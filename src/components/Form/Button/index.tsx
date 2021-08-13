import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { RectButtonProps } from 'react-native-gesture-handler';
import * as S from './styles';

interface Props extends RectButtonProps {
    title: string;
    onPress: () => void;
}

export default function Button({ title, onPress, ...rest }: Props) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <S.Container {...rest}>
                <S.Title>{title}</S.Title>
            </S.Container>
        </TouchableWithoutFeedback>

    )
}
