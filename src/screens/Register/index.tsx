import React, { useState } from 'react';
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


interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório.'),
    amount: Yup.number().typeError('Informe um valor numérico.').positive('O valor não pode ser negativo'),
})
export default function Register() {
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    })
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

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

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.name
        }
        console.log(data)
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
