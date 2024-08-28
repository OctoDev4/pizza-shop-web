import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { OrderStatus } from '@/components/order-status'
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getOrderDetails } from "@/api/get-orders-details.ts"

export interface OrderDetailsProps {
    orderId: string
    open: boolean
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
    // Fetches the order details when the dialog is open
    const { data: order } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderDetails({ orderId }),
        enabled: open,
    })

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Pedido: {orderId}</DialogTitle> {/* Displays the order ID in the dialog title */}
                <DialogDescription>Detalhes do pedido</DialogDescription> {/* Provides a description of the dialog */}
            </DialogHeader>

            {order && (
                <div className="space-y-6">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-muted-foreground">Status</TableCell>
                                <TableCell className="flex justify-end">
                                    <OrderStatus status={order.status} /> {/* Displays the order status */}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground">Cliente</TableCell>
                                <TableCell className="flex justify-end">
                                    {order.customer.name} {/* Displays the customer's name */}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground">Telefone</TableCell>
                                <TableCell className="flex justify-end">
                                    {order.customer.phone ?? 'Não informado'} {/* Displays the customer's phone or a placeholder */}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground">E-mail</TableCell>
                                <TableCell className="flex justify-end">
                                    {order.customer.email} {/* Displays the customer's email */}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-muted-foreground">Realizado há</TableCell>
                                <TableCell className="flex justify-end">
                                    {formatDistanceToNow(order.createdAt, {
                                        locale: ptBR,
                                        addSuffix: true,
                                    })} {/* Displays the time since the order was created */}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead className="text-right">Qtd.</TableHead>
                                <TableHead className="text-right">Preço</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.orderItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        {(item.priceInCents / 100).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })} {/* Displays the price of the product */}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {((item.priceInCents * item.quantity) / 100).toLocaleString(
                                            'pt-BR',
                                            {
                                                style: 'currency',
                                                currency: 'BRL',
                                            },
                                        )} {/* Displays the subtotal for the item */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total do pedido</TableCell>
                                <TableCell className="text-right font-medium">
                                    {(order.totalInCents / 100).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })} {/* Displays the total amount of the order */}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            )}
        </DialogContent>
    )
}
