import React from 'react'
import HighlightCard from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import * as  S from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export default function Dashboard() {
    const data: DataListProps[] = [{
        id: '1',
        type: 'positive',
        title: "Desenvolvimento de Sites",
        amount: "R$ 12.0000",
        date: "4/05/2020",
        category: {
            name: 'Vendas',
            icon: 'dollar-sign'
        }
    },
    {
        id: '2',
        type: 'negative',
        title: "Desenvolvimento de Sites",
        amount: "R$ 12.0000",
        date: "4/05/2020",
        category: {
            name: 'Vendas',
            icon: 'coffee'
        }
    },
    {
        id: '3',
        type: 'positive',
        title: "Desenvolvimento de Sites",
        amount: "R$ 12.0000",
        date: "4/05/2020",
        category: {
            name: 'Vendas',
            icon: 'shopping-bag'
        }
    }
    ]

    return (
        <S.Container>
            <S.Header>
                <S.UserWrapper>
                    <S.UserInfo>
                        <S.Photo source={{ uri: 'https://avatars.githubusercontent.com/u/52255226?v=4' }} />
                        <S.User>
                            <S.UserGreeting>Olá</S.UserGreeting>
                            <S.UserName>Rubens</S.UserName>
                        </S.User>
                    </S.UserInfo>
                    <S.Icon name="power" />
                </S.UserWrapper>

            </S.Header>
            <S.HighlightCards>
                <HighlightCard
                    title="Entradas"
                    amount="R$17.400"
                    lastTransaction="Última entrada dia 13 de abril"
                    type="up"
                />
                <HighlightCard
                    title="Saidas"
                    amount="R$17.400"
                    lastTransaction="Última entrada dia 13 de abril"
                    type="down"
                />
                <HighlightCard
                    title="Total"
                    amount="R$21.400"
                    lastTransaction="Última entrada dia 13 de abril"
                    type="total"
                />
            </S.HighlightCards>

            <S.Transaction>
                <S.Title>Listagem</S.Title>

                <S.TransactionsList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

            </S.Transaction>
        </S.Container>
    )
}
