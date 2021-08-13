import React, { useEffect, useState } from 'react';
import HystoryCard from '../../components/HystoryCard';
import * as S from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';

interface TransactionsData {
    type: 'up' | 'down';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    color: string;
    total: string;
}
export default function Resume() {

    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const loadData = async () => {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : '';

        const expenses = responseFormatted.filter((expense: TransactionsData) => expense.type === 'down');

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expenses.forEach((expense: TransactionsData) => {
                if (expense.category === category.key) {
                    categorySum += Number(expense.amount);
                }
            });

            if (categorySum > 0) {
                const total = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total,
                });
            }


        });

        setTotalByCategories(totalByCategory);

    }

    useEffect(() => {
        loadData();
    }, [])
    return (
        <S.Container>
            <S.Header>
                <S.Title>Resumo por Categoria</S.Title>
            </S.Header>

            <S.Content>
                {totalByCategories.map(item => (
                    <HystoryCard title={item.name} amount={item.total} color={item.color} key={item.key} />
                ))}
            </S.Content>

        </S.Container>

    )
}

