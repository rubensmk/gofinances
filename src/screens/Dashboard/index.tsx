import React, { useCallback, useEffect, useState } from 'react'
import HighlightCard from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import * as  S from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import theme from '../../global/styles/theme';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps;
}
export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactionsData, setTransactionsData] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const getLastTransactionDate = (collection: DataListProps[], type: 'up' | 'down') => {
        const lastTransaction = new Date(Math.max.apply(
            Math, collection.filter(transaction => transaction.type === type)
                .map(transaction => new Date(transaction.date).getTime())
        ));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
    }
    const loadTransactions = async () => {
        const dataKey = '@gofinances:transactions'
        const response = await AsyncStorage.getItem(dataKey)

        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensesTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

            if (item.type === 'up') {
                entriesTotal += Number(item.amount);
            } else {
                expensesTotal += Number(item.amount);
            }


            const amount = formatCurrency(Number(item.amount));

            const date = formatDate(item.date);

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });
        const lastTransactionEntries = getLastTransactionDate(transactions, 'up');
        const lastTransactionExpenses = getLastTransactionDate(transactions, 'down');
        const totalInterval = `01 a ${lastTransactionExpenses}`
        setHighlightData({
            entries: {
                amount: formatCurrency(entriesTotal),
                lastTransaction: lastTransactionEntries,
            },
            expenses: {
                amount: formatCurrency(expensesTotal),
                lastTransaction: lastTransactionExpenses,
            },
            total: {
                amount: formatCurrency(entriesTotal - expensesTotal),
                lastTransaction: totalInterval
            },

        });
        setTransactionsData(transactionsFormatted);
        setIsLoading(false);


    }

    useEffect(() => {
        loadTransactions();
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <S.Container>
            {isLoading ? (
                <S.LoadingContainer>
                    <ActivityIndicator color={theme.colors.secondary} />
                </S.LoadingContainer>)
                :
                <>
                    <S.Header>
                        <S.UserWrapper>
                            <S.UserInfo>
                                <S.Photo source={{ uri: 'https://avatars.githubusercontent.com/u/52255226?v=4' }} />
                                <S.User>
                                    <S.UserGreeting>Olá</S.UserGreeting>
                                    <S.UserName>Rubens</S.UserName>
                                </S.User>
                            </S.UserInfo>
                            <S.LogOutButton>
                                <S.Icon name="power" />
                            </S.LogOutButton>
                        </S.UserWrapper>

                    </S.Header>
                    <S.HighlightCards>
                        <HighlightCard
                            title="Entradas"
                            amount={highlightData.entries?.amount}
                            lastTransaction={`Última entrada ${highlightData.entries?.lastTransaction}`}
                            type="up"
                        />
                        <HighlightCard
                            title="Saidas"
                            amount={highlightData.expenses?.amount}
                            lastTransaction={`Última saída ${highlightData.expenses?.lastTransaction}`}
                            type="down"
                        />
                        <HighlightCard
                            title="Total"
                            amount={highlightData.total?.amount}
                            lastTransaction={`${highlightData.total?.lastTransaction}`}
                            type="total"
                        />
                    </S.HighlightCards>

                    <S.Transaction>
                        <S.Title>Listagem</S.Title>

                        <S.TransactionsList
                            data={transactionsData}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />

                    </S.Transaction>
                </>
            }

        </S.Container>
    )
}
