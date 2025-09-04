import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trash2,
  MoreVertical,
  Calendar,
  Users,
  Bed,
  Package,
  Eye,
  ArrowRight,
} from "lucide-react";
import { BookingsGetOne } from "@/modules/bookings/types";
import { BookingStatus } from "@/types";

interface BookingsCardsProps {
  data: BookingsGetOne[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: BookingStatus) => void;
}

export function BookingsCards({
  data,
  onDelete,
  onStatusChange,
}: BookingsCardsProps) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mb-3">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No bookings found</h3>
        <p className="text-sm text-muted-foreground">
          Bookings will appear here once created
        </p>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return { variant: "default" as const, dot: "bg-green-500" };
      case "pending":
        return { variant: "secondary" as const, dot: "bg-yellow-500" };
      case "completed":
        return { variant: "outline" as const, dot: "bg-blue-500" };
      case "cancelled":
        return { variant: "destructive" as const, dot: "bg-red-500" };
      default:
        return { variant: "outline" as const, dot: "bg-gray-500" };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };
  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    return `${diffDays - 1} days ago`;
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((booking) => {
        const statusConfig = getStatusConfig(booking.status ?? "");
        const initials =
          booking.fullName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "?";

        return (
          <Card
            key={booking.id}
            className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            {/* Compact Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">
                      {booking.fullName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      <div>
                        <span>{booking.phone}</span>
                        <span className="mx-1"></span>
                        <Badge variant="outline" className="text-xs">
                          {getTimeAgo(booking.createdAt)}
                        </Badge>
                      </div>
                      <div>
                        <span>{booking.email}</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onDelete(booking.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* Compact Content */}
            <CardContent className="space-y-3 py-0">
              {/* Package */}
              <div className="flex items-center space-x-2 text-xs">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span className="truncate font-medium">
                  {booking.packageTitle || "No package"}
                </span>
              </div>

              {/* Travel Dates - Horizontal */}
              <div className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1.5">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-green-600" />
                  <span className="font-medium text-green-700">
                    {formatDate(booking.departureDate)}
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-orange-700">
                    {formatDate(booking.returnDate)}
                  </span>
                  <Calendar className="h-3 w-3 text-orange-600" />
                </div>
              </div>

              {/* Trip Details - Inline */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {booking.travelers}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bed className="h-3 w-3 text-purple-600" />
                  <span className="text-purple-700 font-medium truncate max-w-16">
                    {booking.roomType}
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Compact Footer */}
            <CardFooter className="pt-3 pb-3">
              <div className="flex items-center justify-between w-full">
                <Select
                  value={booking.status || "pending"}
                  onValueChange={(val) =>
                    onStatusChange(booking.id, val as BookingStatus)
                  }
                >
                  <SelectTrigger className="w-35 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="confirmed">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Confirmed
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Cancelled
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
