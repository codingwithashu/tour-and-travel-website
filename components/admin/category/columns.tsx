import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconCategory,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import { CategoryGetOne } from "@/modules/category/types";

interface CategoryColumnsProps {
  handleEditCategory: (category: CategoryGetOne) => void;
  handleDeleteCategory: (id: number) => void;
}

export const createCategoryColumns = ({
  handleEditCategory,
  handleDeleteCategory,
}: CategoryColumnsProps): ColumnDef<CategoryGetOne>[] => [
  {
    accessorKey: "name" as keyof CategoryGetOne,
    header: "Category Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary">
            <IconCategory className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.name}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "description" as keyof CategoryGetOne,
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-md">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {row.original.description}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit category</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete category</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
