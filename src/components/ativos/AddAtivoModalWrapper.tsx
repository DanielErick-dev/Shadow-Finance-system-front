"use client"
import { useState } from 'react'
import GenericFormModal from '@base/components/ui/custom/GenericFormModal'
import { useAtivosStore, type NewAtivoData } from '@base/store/UseAtivoStore'
import { Input } from '@base/components/ui/input'
import { Label } from '@base/components/ui/label'

export default function AddAtivoModalWrapper() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<NewAtivoData>({
        codigo: '',
        tipo: 'ACAO', 
    });

    const { addAtivo } = useAtivosStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'codigo' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await addAtivo(formData);
            setFormData({ codigo: '', tipo: 'ACAO' });
        } catch (error) {
            console.error("Falha na submissão do formulário de ativo.", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <GenericFormModal
            title="[ ADICIONAR NOVO ATIVO ]"
            description="「 Registre um novo ativo em sua carteira 」"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitText="REGISTRAR ATIVO"
            triggerButton={
                <button
                    type="button"
                    className="group p-1.5 rounded-full hover:bg-slate-700 transition-colors"
                    aria-label="Adicionar Novo Ativo"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            }
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="codigo" className="text-sm font-semibold text-purple-300 tracking-wide">
                        CÓDIGO DO ATIVO
                    </Label>
                    <Input
                        id="codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        placeholder="Ex: MXRF11"
                        disabled={isSubmitting}
                        className="bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-slate-500 uppercase"
                        autoComplete="off"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tipo" className="text-sm font-semibold text-purple-300 tracking-wide">
                        TIPO
                    </Label>
                    <select
                        id="tipo"
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
    )
}
