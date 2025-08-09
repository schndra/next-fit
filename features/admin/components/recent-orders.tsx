import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

const orders = [
  {
    id: "#3210",
    customer: "John Doe",
    email: "john@example.com",
    total: "$299.99",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#3209",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: "$149.99",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "#3208",
    customer: "Bob Johnson",
    email: "bob@example.com",
    total: "$89.99",
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "#3207",
    customer: "Alice Brown",
    email: "alice@example.com",
    total: "$199.99",
    status: "pending",
    date: "2024-01-14",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RecentOrders() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{order.customer}</div>
                <div className="text-sm text-muted-foreground">
                  {order.email}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-medium">{order.total}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
