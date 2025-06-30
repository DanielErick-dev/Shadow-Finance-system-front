"use client";
import { useState, useEffect } from 'react';
import GenericFormModal from '@base/components/ui/custom/GenericFormModal';
import { useAtivosStore, type NewAtivoData } from '@base/store/UseAtivoStore';
import { Input } from '@base/components/ui/input';
import { Label } from '@base/components/ui/label';
import type { Ativo } from '@base/types/dividends';

type EditAtivoModalWrapperProps = {
    ativoToEdit: Ativo | null; 
    onClose: () => void;
};

export default function EditAtivoModalWrapper({ ativoToEdit, onClose }: EditAtivoModalWrapperProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<NewAtivoData>({ codigo: '', tipo: 'ACAO' });

    const { updateAtivo } = useAtivosStore();

    useEffect(() => {
        if (ativoToEdit) {
            setFormData({
                codigo: ativoToEdit.codigo,
                tipo: ativoToEdit.tipo,
            });
        }
    }, [ativoToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'codigo' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async () => {
        if (!ativoToEdit) return;

        setIsSubmitting(true);
        try {
            await updateAtivo(ativoToEdit.id, formData);
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const isOpen = !!ativoToEdit;

    if (!isOpen) {
        return null;
    }

    return (
        <GenericFormModal
            open={isOpen}
            onOpenChange={(openState) => {
                if (!openState) {
                    onClose();
                }
            }}

            title="[ EDITAR ATIVO ]"
            description="「 Modifique os detalhes do seu ativo na carteira 」"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitText="SALVAR ALTERAÇÕES"
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-codigo" className="text-sm font-semibold text-purple-300 tracking-wide">
                        CÓDIGO DO ATIVO
                    </Label>
                    <Input
                        id="edit-codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-slate-500 uppercase"
                        autoComplete="off"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-tipo" className="text-sm font-semibold text-purple-300 tracking-wide">
                        TIPO
                    </Label>
                    <select
                        id="edit-tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="block w-full bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 text-white rounded-md shadow-sm p-2.5"
                    >
                        <option value="ACAO">Ação</option>
                        <option value="FII">Fundo Imobiliário</option>
                        <option value="BDR">BDR</option>
                        <option value="ETF">ETF</option>
                    </select>
                </div>
            </div>
        </GenericFormModal>
    );
}
