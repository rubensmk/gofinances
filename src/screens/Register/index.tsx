import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { useForm } from 'react-hook-form';
import Button from '../../components/Form/Button';
import CategorySelectButton from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import TransactionTypeButton from '../../components/Form/TransactionTypeButton';
import CategorySelect from '../CategorySelect';

import * as S from './styles';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native'
import Dashboard from '../Dashboard';
import { useAuth } from '../../hooks/auth';


interface FormData {
    name: string;
    amount: string;
}

type NavigationProps = {
    navigate: (screen: string) => void;
}
const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório.'),
    amount: Yup.number().typeError('Informe um valor numérico.').positive('O valor não pode ser negativo').required('O valor é obrigatório'),
})
export default function Register() {
    const { user } = useAuth();
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    })
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const navigation = useNavigation<NavigationProps>();

    const handleTransactionsTypeSelect = async (type: 'up' | 'down') => {
        setTransactionType(type);
    }
    const handleCloseCategoryModal = async () => {
        setCategoryModalOpen(false);
    }
    const handleOpenCategoryModal = async () => {
        setCategoryModalOpen(true);
    }
    const handleRegister = async (form: FormData) => {
        if (!transactionType) {
            return Alert.alert('Selecione o tipo de transação.')
        }
        if (category.key === 'category') {
            return Alert.alert('Selecione uma categoria.')
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Category',
            })

            navigation.navigate('Listagem');
        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível salvar.')
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <S.Container>
                <S.Header>
                    <S.Title>Cadastro</S.Title>
                </S.Header>
                <S.Form>
                    <S.Fields>
                        <InputForm
                            control={control}
                            name="name"
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            control={control}
                            name="amount"
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <S.TransactionTypes>
                            <TransactionTypeButton
                                title="Income"
                                type="up"
                                onPress={() => handleTransactionsTypeSelect('up')}
                                isActive={transactionType === 'up'}
                            />
                            <TransactionTypeButton
                                title="Outcome"
                                type="down"
                                onPress={() => handleTransactionsTypeSelect('down')}
                                isActive={transactionType === 'down'}
                            />
                        </S.TransactionTypes>
                        <CategorySelectButton title={category.name} onPress={handleOpenCategoryModal} />
                    </S.Fields>
                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                </S.Form>
                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseCategoryModal}
                    />
                </Modal>
            </S.Container>
        </TouchableWithoutFeedback>
    )
}

