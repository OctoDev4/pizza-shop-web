import { isAxiosError } from 'axios'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Header } from '@/components/header'
import { api } from '@/lib/axios'

export function AppLayout() {
    // `useNavigate` é um hook do React Router que permite a navegação programática entre rotas.
    const navigate = useNavigate()

    useEffect(() => {
        // Adiciona um interceptor de resposta ao Axios. Um interceptor permite interceptar
        // e modificar as requisições ou respostas antes que elas sejam processadas pelo `.then()` ou `.catch()`.
        const interceptorId = api.interceptors.response.use(
            // O primeiro argumento (response) é chamado para respostas bem-sucedidas (status 2xx).
            (response) => response,

            // O segundo argumento (error) é chamado para respostas com erro (status fora da faixa 2xx).
            (error) => {
                // Verifica se o erro é um erro do Axios.
                if (isAxiosError(error)) {
                    // Extrai o código de status HTTP da resposta de erro.
                    const status = error.response?.status
                    // Extrai um código de erro específico do payload de dados da resposta.
                    const code = error.response?.data.code

                    // Se o código de status for 401 (não autorizado) e o código de erro específico for 'UNAUTHORIZED',
                    // redireciona o usuário para a página de login ('/sign-in').
                    if (status === 401 && code === 'UNAUTHORIZED') {
                        navigate('/sign-in', { replace: true })
                        // O `replace: true` evita que a página atual seja empilhada no histórico de navegação,
                        // substituindo a entrada atual, o que impede o usuário de voltar para a página anterior.
                    }
                }
            },
        )

        // Retorna uma função de limpeza que é chamada quando o componente é desmontado.
        // Aqui, removemos o interceptor adicionado, para evitar vazamentos de memória e interceptações indesejadas
        // quando o componente não estiver mais montado.
        return () => {
            api.interceptors.response.eject(interceptorId)
            // `eject(interceptorId)` remove o interceptor que foi adicionado anteriormente, usando o ID retornado ao adicioná-lo.
        }
    }, [navigate]) // `navigate` é uma dependência do `useEffect`, ou seja, o efeito será reexecutado se `navigate` mudar.

    return (
        <div className="flex min-h-screen flex-col antialiased">

            <Header />

            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">

                <Outlet />
            </div>
        </div>
    )
}
