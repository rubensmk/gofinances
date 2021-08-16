import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import HystoryCard from '../../components/HystoryCard';
import * as S from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/auth';
interface TransactionData {
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
    total: number;
    totalFormatted: string;
    percent: string;
}
export default function Resume() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const { user } = useAuth();
    const theme = useTheme();

    function handleDateChange(action: 'prev' | 'next') {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    const loadData = async () => {
        setIsLoading(true);
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : '';

        const expenses = responseFormatted?.filter((expensive: TransactionData) =>
            expensive.type === 'down' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        );


        const expensesTotal = expenses.reduce((acc: number, expense: TransactionData) => {
            return acc + Number(expense.amount);
        }, 0);
        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expenses.forEach((expense: TransactionData) => {
                if (expense.category === category.key) {
                    categorySum += Number(expense.amount);
                }
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const percent = `${(categorySum / expensesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                });
            }


        });

        setTotalByCategories(totalByCategory);
        setIsLoading(false);

    }


    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return (
        <S.Container>
            <S.Header>
                <S.Title>Resumo por Categoria</S.Title>
            </S.Header>
            {isLoading ? (
                <S.LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </S.LoadContainer>
            ) :
                (
                    <S.Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight(),
                        }}
                    >

                        <S.MonthSelect>
                            <S.MonthSelectButton onPress={() => handleDateChange('prev')}>
                                <S.MonthSelectIcon name="chevron-left" />
                            </S.MonthSelectButton>

                            <S.Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</S.Month>

                            <S.MonthSelectButton onPress={() => handleDateChange('next')}>
                                <S.MonthSelectIcon name="chevron-right" />
                            </S.MonthSelectButton>

                        </S.MonthSelect>

                        <S.ChartContainer>
                            <VictoryPie
                                data={totalByCategories}
                                x="percent"
                                y="total"
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={50}
                            />
                        </S.ChartContainer>
                        {totalByCategories.map(item => (
                            <HystoryCard title={item.name} amount={item.totalFormatted} color={item.color} key={item.key} />
                        ))}
                    </S.Content>
                )}
        </S.Container>

    )
}

