import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    image: "/placeholder.svg?height=50&width=50",
    sales: 234,
    revenue: "$23,400",
  },
  {
    id: "2",
    name: "Smart Watch",
    image: "/placeholder.svg?height=50&width=50",
    sales: 189,
    revenue: "$18,900",
  },
  {
    id: "3",
    name: "Laptop Stand",
    image: "/placeholder.svg?height=50&width=50",
    sales: 156,
    revenue: "$15,600",
  },
  {
    id: "4",
    name: "Phone Case",
    image: "/placeholder.svg?height=50&width=50",
    sales: 134,
    revenue: "$13,400",
  },
];

export function TopProducts() {
  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={product.id} className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={50}
              height={50}
              className="rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </p>
            <p className="text-sm text-gray-500">{product.sales} sales</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {product.revenue}
            </p>
            <Badge variant="secondary" className="text-xs">
              #{index + 1}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
