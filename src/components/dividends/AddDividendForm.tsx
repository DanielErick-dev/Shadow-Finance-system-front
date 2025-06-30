'use client'

import { useState, useEffect } from 'react';
import { Ativo, ItemDividendo } from '@base/types/dividends';
import AddAtivoModalWrapper from '@base/components/ativos/AddAtivoModalWrapper';
import toast from 'react-hot-toast';


type FormState = {
    ativoCodigo: string;
    valor: string; 
    data: string;
}

export type DividendFormData = {
    ativoCodigo: string;
    valor: number;
    data: string;
}

type Props = {
    onSave: (formData: DividendFormData) => Promise<void>;
    onCancel: () => void;
    ativosDisponiveis: Ativo[];
    initialData?: Omit<ItemDividendo, 'id'>;
    submitButtonText?: string;
}

export function AddDividendForm({
    onSave,
    onCancel, 
    ativosDisponiveis,
    initialData, 
    submitButtonText = 'Adicionar' 
}: Props) {
    const getInitialFormState = (): FormState => {
        if (initialData) {
            return {
                ativoCodigo: initialData.ativo.codigo,
                valor: String(initialData.valor),
                data: initialData.data
            };
        }
        return {
            ativoCodigo: ativosDisponiveis.length > 0 ? ativosDisponiveis[0].codigo : '',
            valor: '',
            data: new Date().toISOString().split('T')[0]
        }
    }

    const [form, setForm] = useState<FormState>(getInitialFormState());
    const [isSubmitting, setIsSubmitting] = useState(false);
      
    useEffect(() => {
        setForm(getInitialFormState());
    }, [initialData, ativosDisponiveis]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!form.ativoCodigo) {
            toast.error('Por favor, selecione um ativo válido.');
            return;
        }
        if (form.valor === '' || Number(form.valor) <= 0) {
            toast.error('Por favor, insira um valor positivo para o dividendo.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSave: DividendFormData = {
                ativoCodigo: form.ativoCodigo,
                valor: Number(form.valor),
                data: form.data,
            };
            await onSave(formDataToSave);
            onCancel(); 
        } catch (error) {
            console.error("Falha ao salvar o formulário de dividendo.", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4 bg-slate-800/70 p-4 rounded-lg border border-slate-700'>
            <div className='flex justify-between items-center'>
                <label htmlFor='ativoCodigo' className='block text-sm font-medium text-purple-300'>
                    Ativo
                </label>
                <AddAtivoModalWrapper />
            </div>
            <select
                id='ativoCodigo'
                name='ativoCodigo'
                value={form.ativoCodigo}
                onChange={handleInputChange}
                className='w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
                required
                disabled={isSubmitting}
            >
                <option value="" disabled>Selecione um ativo</option>
                {ativosDisponiveis.map((ativo) => (
                    <option key={ativo.id} value={ativo.codigo}>{ativo.codigo.toUpperCase()} - ({ativo.tipo})</option>
                ))}
            </select>
            
            <div>
                 <label htmlFor='valor' className='block text-sm font-medium text-purple-300 mb-1'>Valor (R$)</label>
                 <input 
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    value={form.valor}
                    onChange={handleInputChange}
                    className='w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='120.50'
                    required
                    disabled={isSubmitting}
                 />
            </div>
            
            <div>
                 <label htmlFor='data' className='block text-sm font-medium text-purple-300 mb-1'>Data</label>
                 <input 
                    id="data"
                    name="data"
                    type="date"
                    value={form.data}
                    onChange={handleInputChange}
                    className='w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
                    required
                    disabled={isSubmitting}
                 />
            </div>

            <div className='flex justify-end space-x-3 pt-2'>
                <button
                    type="button"
                    onClick={onCancel}
                    className='px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors'
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className='px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? 'Salvando...' : submitButtonText}
                </button>
            </div>
        </form>
    )
}
