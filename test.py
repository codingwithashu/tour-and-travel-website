from flask import Flask,request,send_file
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptConfig
from youtube_transcript_api.formatters import JSONFormatter, TextFormatter, WebVTTFormatter
from youtube_transcript_api.proxies import GenericProxyConfig

from googleapiclient.discovery import build
import re
from flask_jsonpify import jsonify
from bs4 import BeautifulSoup
import requests
import os
import jsons
import yt_dlp
from .set_cookies import set_cookies

app = Flask(__name__)
set_cookies()
# Path to the cookie file
COOKIE_FILE = '/tmp/cookies.txt'


def format_time(seconds):
    hours, remainder = divmod(int(seconds), 3600)
    minutes, seconds = divmod(remainder, 60)
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    else:
        return f"{minutes:02d}:{seconds:02d}"

def chunk_transcript(transcript,min_words=100):
    chunks = []
    current_chunk = {
        'start': transcript[0]['start'],
        'end': transcript[0]['start'],
        'text': ''
    }
    word_count = 0

    for entry in transcript:
        current_chunk['text'] += ' ' + entry['text']
        current_chunk['end'] = entry['start'] + entry['duration']
        word_count += len(entry['text'].split())

        if word_count >= min_words:
            current_chunk['duration'] = current_chunk['end'] - current_chunk['start']
            chunks.append(current_chunk)
            current_chunk = {
                'start': current_chunk['end'],
                'end': current_chunk['end'],
                'text': ''
            }
            word_count = 0

    if current_chunk['text']:
        current_chunk['duration'] = current_chunk['end'] - current_chunk['start']
        chunks.append(current_chunk)

    return chunks

def extract_video_id(url):
  video_id = re.search(r'v=([^&]+)', url)
  if video_id:
    return video_id.group(1)
  else:
    return None
  
def get_video_details(url):
    try:
        api_key = os.environ.get('api_key')
        youtube = build('youtube', 'v3', developerKey=api_key)
        video_id = extract_video_id(url)
        request = youtube.videos().list(
            part='snippet',
            id=video_id
        )
        response = request.execute()

        # Handle case where video is not found
        if not response.get('items'):
            return {
                "title": None,
                "thumbnail_url": None,
                "video_id": video_id,
                "status": "error",
                "message": "Video not found"
            }

        # Extract video information
        info = response['items'][0]['snippet']

        # Get highest quality thumbnail
        thumbnails = info.get('thumbnails', {})
        thumbnail_qualities = ['maxres', 'standard', 'high', 'medium', 'default']
        thumbnail_url = None

        for quality in thumbnail_qualities:
            if quality in thumbnails:
                thumbnail_url = thumbnails[quality]['url']
                break

        return {
            "title": info.get('title'),
            "thumbnail_url": thumbnail_url,
            "video_id": video_id,
            "status": "success"
        }

    except Exception as e:
        return {
            "title": None,
            "thumbnail_url": None,
            "video_id": video_id,
            "status": "error",
            "message": str(e)
        }

def read_cookies_file(file_path):
    """
    Read and print the contents of a cookies.txt file.
    
    Args:
        file_path (str): Path to the cookies.txt file
    """
    try:
        with open(file_path, 'r') as file:
            # Read and print entire file contents
            print(file.read())
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
    except PermissionError:
        print(f"Error: No permission to read {file_path}.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


@app.route('/GetTextsubtitlesV1')
def GetTextsubtitlesV1():
    video_id = request.args.get('video_id')
    filePath = os.path.join(os.getcwd(), 'temp', 'cookies.txt')

    config = TranscriptConfig(cookies=filePath)   # NEW way in v1.2.2
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id, config=config)

    for transcript in transcript_list:
        srt = transcript.fetch()
        formatter = TextFormatter()
        TextFormatter_formatted = formatter.format_transcript(srt)

    return TextFormatter_formatted


@app.route('/GetWebsubtitlesV1')
def GetWebsubtitlesV1():
    url = request.args.get('url')
    video_info = get_video_details(url)
    title = video_info['title']
    thumbnail = video_info['thumbnail_url']
    video_id = video_info['video_id']
    print(video_info)

    filePath = os.path.join(os.getcwd(), 'temp', 'cookies.txt')

    # Proxy Configuration
    username = 'spolsk52eh'
    password = '60YyzuGmsb4ume5gGC'
    proxy_url = f"http://{username}:{password}@gate.smartproxy.com:10001"
    
    proxies = {
        'http': proxy_url,
        'https': proxy_url
    }

    try:
        config = TranscriptConfig(cookies=filePath, proxies=proxies)

        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id, config=config)

        # Fetch English transcript (auto-generated or manually uploaded)
        transcript = transcript_list.find_transcript(['en']).fetch()

        formatter = TextFormatter()
        TextFormatter_formatted = formatter.format_transcript(transcript)
        objchunk_transcript = chunk_transcript(transcript)

        return {
            "title": title,
            "thumbnail": thumbnail,
            "transcript": objchunk_transcript,
            "raw_transcript": TextFormatter_formatted
        }

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/video_info', methods=['GET'])
def get_video_info():
    video_url = request.args.get('url')
    
    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        ydl_opts = {
            'skip_download': True,
            'cookiefile': COOKIE_FILE if os.path.exists(COOKIE_FILE) else None,
        }
        #read_cookies_file(COOKIE_FILE)
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
        
        return jsonify(ydl.sanitize_info(info))

    except Exception as e:
        return jsonify({"error": str(e)}), 500