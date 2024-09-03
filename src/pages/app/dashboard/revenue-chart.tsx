import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import { getDailyRevenueInPeriod } from '@/api/get-daily-revenue-in-period'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from "@/components/ui/date-ranger-picker.tsx";

export function RevenueChart() {
    // Estado para controlar o intervalo de datas selecionado
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7), // Data de início: 7 dias atrás
        to: new Date(), // Data de fim: hoje
    });

    // Hook useQuery para buscar os dados de receita diária no período selecionado
    const { data: dailyRevenueInPeriod } = useQuery({
        queryKey: ['metrics', 'daily-revenue-in-period', dateRange],
        queryFn: () =>
            getDailyRevenueInPeriod({
                from: dateRange?.from,
                to: dateRange?.to,
            }),
    });

    // Transformar os dados recebidos para o formato necessário para o gráfico
    const chartData = useMemo(() => {
        return dailyRevenueInPeriod?.map((chartItem) => {
            return {
                date: chartItem.date,
                receipt: chartItem.receipt / 100, // Converter centavos para reais
            };
        });
    }, [dailyRevenueInPeriod]);

    return (
        <Card className="col-span-6">
            {/* Cabeçalho do cartão */}
            <CardHeader className="flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                        Receita no período
                    </CardTitle>
                    <CardDescription>Receita diária no período</CardDescription>
                </div>

                <div className="flex items-center gap-3">
                    <Label>Período</Label>
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                </div>
            </CardHeader>
            <CardContent>
                {/* Renderiza o gráfico se houver dados disponíveis */}
                {chartData && (
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={chartData} style={{ fontSize: 12 }}>
                            {/* Eixo X do gráfico */}
                            <XAxis
                                dataKey="date"
                                axisLine={false} // Ocultar linha do eixo
                                tickLine={false} // Ocultar linhas dos ticks
                                dy={16} // Ajuste de posição vertical dos ticks
                            />
                            {/* Eixo Y do gráfico */}
                            <YAxis
                                stroke="#888" // Cor da linha do eixo Y
                                axisLine={false} // Ocultar linha do eixo
                                tickLine={false} // Ocultar linhas dos ticks
                                width={80} // Largura do eixo Y
                                tickFormatter={(value: number) =>
                                    value.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })
                                }
                            />
                            {/* Tooltip para mostrar informações ao passar o mouse */}
                            <Tooltip />
                            {/* Grid do gráfico */}
                            <CartesianGrid vertical={false} className="stroke-muted" />
                            {/* Linha do gráfico */}
                            <Line
                                stroke={colors.violet[500]} // Cor da linha
                                type="linear" // Tipo de linha
                                strokeWidth={2} // Largura da linha
                                dataKey="receipt" // Chave dos dados para a linha
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
