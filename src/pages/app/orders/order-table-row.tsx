// Importa hooks e utilitários do React Query e outras bibliotecas
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {formatDistanceToNow} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import {ArrowRight, Search, X} from 'lucide-react'
import {useState} from 'react'

// Importa funções de API e componentes personalizados
import {approveOrder} from '@/api/approve-order.ts'
import {cancelOrder} from '@/api/cancel-order.ts'
import {deliverOrder} from '@/api/deliver-order.ts'
import {dispatchOrder} from '@/api/dispatch-order.ts'
import {GetOrdersResponse} from '@/api/get-orders.ts'
import {OrderStatus} from '@/components/order-status.tsx'
import {Button} from '@/components/ui/button.tsx'
import {Dialog, DialogTrigger} from '@/components/ui/dialog.tsx'
import {TableCell, TableRow} from '@/components/ui/table.tsx'

import {OrderDetails} from './order-details.tsx'

// Define as propriedades esperadas para o componente OrderTableRow
interface OrderTableRowProps {
    order: {
        orderId: string
        createdAt: string
        status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
        customerName: string
        total: number
    }
}

// Componente que representa uma linha da tabela de pedidos
export function OrderTableRow({order}: OrderTableRowProps) {
    // Estado local para controlar a abertura dos detalhes do pedido
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    // Instancia o cliente de queries do React Query
    const queryClient = useQueryClient()

    // Função para atualizar o status de um pedido no cache do React Query
    function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
        // Obtém os dados do cache relacionados a pedidos
        const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
            queryKey: ['orders'],
        })

        // Atualiza o status do pedido específico no cache
        ordersListCache.forEach(([cacheKey, cacheData]) => {
            if (!cacheData) {
                return
            }

            // Atualiza o cache com o novo status do pedido
            queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
                ...cacheData,
                orders: cacheData.orders.map((order) => {
                    if (order.orderId === orderId) {
                        return {...order, status}
                    }

                    return order
                }),
            })
        })
    }

    {/*

        on sucess retorna onSuccess: async (data, variables, context) => {
        }

        data: Este parâmetro contém os dados retornados pela função de mutação (mutationFn) após a execução bem-sucedida.

        variables: Estes são os mesmos parâmetros que foram passados para a função de mutação ao chamá-la. Por exemplo, no caso de approveOrderFn({ orderId: order.orderId }), variables conterá { orderId: order.orderId }.


context: Este parâmetro é opcional e pode ser usado para armazenar e acessar informações entre onMutate (uma função chamada antes da mutação começar) e onSuccess.
      */
    }

    // Mutations para diferentes ações de pedidos, cada uma com seu status e função de callback de sucesso
    const {mutateAsync: cancelOrderFn, isPending: isCancelingOrder} =
        useMutation({
            mutationFn: cancelOrder,
            async onSuccess(_, {orderId}) {
                updateOrderStatusOnCache(orderId, 'canceled')
            },
        })

    const {mutateAsync: approveOrderFn, isPending: isApprovingOrder} =
        useMutation({
            mutationFn: approveOrder,
            async onSuccess(_, {orderId}) {
                updateOrderStatusOnCache(orderId, 'processing')
            },
        })

    const {mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder} =
        useMutation({
            mutationFn: dispatchOrder,
            async onSuccess(_, {orderId}) {
                updateOrderStatusOnCache(orderId, 'delivering')
            },
        })

    const {mutateAsync: deliverOrderFn, isPending: isDeliveringOrder} =
        useMutation({
            mutationFn: deliverOrder,
            async onSuccess(_, {orderId}) {
                updateOrderStatusOnCache(orderId, 'delivered')
            },
        })

    // Retorna a linha da tabela com as células de dados e ações
    return (
        <TableRow>
            <TableCell>
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Search className="h-3 w-3"/>
                            <span className="sr-only">Detalhes do pedido</span>
                        </Button>
                    </DialogTrigger>

                    <OrderDetails open={isDetailsOpen} orderId={order.orderId}/>
                </Dialog>
            </TableCell>
            <TableCell className="font-mono text-xs font-medium">
                {order.orderId}
            </TableCell>
            <TableCell className="text-muted-foreground">
                {formatDistanceToNow(order.createdAt, {
                    locale: ptBR,
                    addSuffix: true,
                })}
            </TableCell>
            <TableCell>
                <OrderStatus status={order.status}/>
            </TableCell>
            <TableCell className="font-medium">{order.customerName}</TableCell>
            <TableCell className="font-medium">
                {(order.total / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
            </TableCell>
            <TableCell>
                {order.status === 'pending' && (
                    <Button
                        variant="outline"
                        disabled={isApprovingOrder}
                        size="sm"
                        onClick={() => approveOrderFn({orderId: order.orderId})}
                    >
                        <ArrowRight className="mr-2 h-3 w-3"/>
                        Aprovar
                    </Button>
                )}

                {order.status === 'processing' && (
                    <Button
                        variant="outline"
                        disabled={isDispatchingOrder}
                        size="sm"
                        onClick={() => dispatchOrderFn({orderId: order.orderId})}
                    >
                        <ArrowRight className="mr-2 h-3 w-3"/>
                        Em entrega
                    </Button>
                )}

                {order.status === 'delivering' && (
                    <Button
                        variant="outline"
                        disabled={isDeliveringOrder}
                        size="sm"
                        onClick={() => deliverOrderFn({orderId: order.orderId})}
                    >
                        <ArrowRight className="mr-2 h-3 w-3"/>
                        Entregue
                    </Button>
                )}
            </TableCell>
            <TableCell>
                <Button
                    disabled={
                        !['pending', 'processing'].includes(order.status) ||
                        isCancelingOrder
                    }
                    onClick={() => cancelOrderFn({orderId: order.orderId})}
                    variant="ghost"
                    size="sm"
                >
                    <X className="mr-2 h-3 w-3"/>
                    Cancelar
                </Button>
            </TableCell>
        </TableRow>
    )
}
