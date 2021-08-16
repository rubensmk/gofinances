import React, { useEffect, useState } from 'react'
import * as S from './styles'

import LogoSvg from '../../assets/logo.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';

import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';
import { ActivityIndicator, Alert, Platform } from 'react-native';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const { signInWithApple, signInWithGoogle, user } = useAuth();

    const handleSignInWithGoogle = async () => {
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch (error) {
            Alert.alert('Não foi possivel conectar a conta do Google.');
            setIsLoading(false);
        }
    }

    const handleSignInWithApple = async () => {
        try {
            setIsLoading(true);
            return await signInWithApple();
        } catch (error) {
            Alert.alert('Não foi possivel conectar a conta Apple.');
            setIsLoading(false);
        }

    }


    return (
        <S.Container>
            <S.Header>
                <S.TitleWrapper>
                    <LogoSvg width={RFValue(120)} height={RFValue(68)} />
                    <S.Title>Controle suas {'\n'} finanças de forma {'\n'} muito simples</S.Title>
                </S.TitleWrapper>

                <S.SignInTitle>Faça seu login com {'\n'} uma das contas abaixo</S.SignInTitle>
            </S.Header>

            <S.Footer>
                <S.FooterWrapper>
                    <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} onPress={handleSignInWithGoogle} />
                    {Platform.OS === 'ios' && <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} onPress={handleSignInWithApple} />}
                </S.FooterWrapper>
                {isLoading && <ActivityIndicator style={{ marginTop: 18 }} color="white" />}
            </S.Footer>
        </S.Container>
    )
}
