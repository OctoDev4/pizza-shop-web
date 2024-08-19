import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer, Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

// Dados fictícios representando a receita diária em um período de 7 dias
const data = [
    { date: '10/12', revenue: 1200 },
    { date: '11/12', revenue: 800 },
    { date: '12/12', revenue: 900 },
    { date: '13/12', revenue: 400 },
    { date: '14/12', revenue: 2300 },
    { date: '15/12', revenue: 800 },
    { date: '16/12', revenue: 640 },
]

export function RevenueChart() {
    return (
        <Card className="col-span-6">
            <CardHeader className="flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                    {/* Título do gráfico */}
                    <CardTitle className="text-base font-medium">
                        Receita no período
                    </CardTitle>
                    {/* Descrição do gráfico */}
                    <CardDescription>Receita diária no período</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {/* Container que ajusta automaticamente o gráfico ao tamanho do contêiner pai */}
                <ResponsiveContainer width="100%" height={240}>
                    {/* Criação do gráfico de linha com os dados fornecidos */}
                    <LineChart data={data} style={{ fontSize: 12 }}>
                        {/* Eixo X representando as datas */}
                        <XAxis dataKey="date" axisLine={false} tickLine={false} dy={16} />

                        {/* Eixo Y representando a receita, formatada como moeda brasileira */}
                        <YAxis
                            dataKey='revenue'
                            stroke="#888"
                            axisLine={false}
                            tickLine={false}
                            width={80}
                            tickFormatter={(value: number) =>
                                value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })
                            }
                        />
                        {/* Linha do gráfico que conecta os pontos de receita ao longo do período */}
                        <Line
                            stroke={'#EA580C'} // Cor da linha usando uma cor da paleta Tailwind
                            type="natural"
                            strokeWidth={2} // Espessura da linha
                            dataKey="revenue" // Chave que especifica quais dados plotar na linha
                        />
                        {/* Tooltip que aparece ao passar o mouse sobre os pontos da linha */}
                        <Tooltip/>
                        <CartesianGrid vertical={false} className='stroke-muted'/>
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
