"use client"
import { useEffect, useState } from "react";
import { useCategoryStore } from "@base/store/useCategoryStore";
import { Pencil, Trash2, Wallet } from "lucide-react";
export default function CategoriesExpensesPage(){
    const { categories, fetchCategories, error, loading } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [categories]);

    if(loading){
        return(
            <div 
                className="flex h-screen items-center justify-center text-lg text-purple-400 animate-pulse"
            >
                [ PROCESSANDO CATEGORIAS... ]
            </div>
        )
    }
    if(error){
        return(
            <div className="flex h-screen items-center justify-center text-lg text-red-400">[ ERRO DE CONEXÃO: {error} ]</div>
        )
    }
    return(
        <div className="min-h-screen text-slate-200 py-6">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-5
                border-b border-purple-800/50">
                    <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text
                    bg-gradient-to-r from-purple-400 to-blue-400 mb-4 sm:mb-0 text-center w-full sm:w-auto">
                        GESTÃO DE CATEGORIAS
                    </h1>
                    <button 
                        className="bg-gradient-to-r from-purple-700 to-purple-600 border border-purple-900/20 rounded-md font-semibold text-white shadow-sm
                        hover:from-purple-600 hover:to-purple-500 hover:shadow-purple-500/30 duration-300 active:scale-95 transition-all px-4 py-2 w-full sm:w-auto cursor-pointer"
                    >
                        ADICIONAR CATEGORIA
                    </button>
                </header>
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg shadow-purple-900/20 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-700 bg-slate-800/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider uppercase">Nome Da Categoria</th>
                                <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider uppercase">ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-slate-800
                                last:border-b-0 hover:bg-slate-800/70 transition-colors">
                                    <td className="p-4 text-slate-400">{category.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="p-2 rounded-full hover:bg-slate-700 group"
                                            >
                                                <Pencil 
                                                    aria-label="Editar Categoria" 
                                                    className="w-4 h-4 text-slate-400 transition-colors group-hover:text-blue-400 cursor-pointer"
                                                />
                                            </button>
                                            <button
                                                className="p-2 rounded-full hover>bg-slate-700 group"
                                            >
                                                <Trash2 
                                                    aria-label="Deletar Categoria"
                                                    className="w-4 h-4 text-slate-400 transition-colors group-hover:text-red-300 cursor-pointer"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {categories.length === 0 && (
                            <div className="text-center text-slate-500 p-8 flex flex-col items-center gap-4">
                                <Wallet className="w-16 h-16 text-slate-700" />
                                <p>Nenhuma Categoria Cadastrada, clique no botão de adicionar Categoria</p>
                            </div>
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}