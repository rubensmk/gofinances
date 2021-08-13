import React from 'react'
import * as S from './styles';

interface HystoryCardProps {
    color: string;
    title: string;
    amount: string;
}


export default function HystoryCard({ color, title, amount }: HystoryCardProps) {
    return (
        <S.Container color={color}>
            <S.Title>{title}</S.Title>
            <S.Amount>{amount}</S.Amount>
        </S.Container>
    )
}
