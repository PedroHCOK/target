//criação do hook personalizado para manipular banco de dado de metas
import { useSQLiteContext } from "expo-sqlite";

export type TargetCreate ={
    name: string;
    amount: number;
}

export type TargetUpdate = TargetCreate & {
    id: number
}

export type TargetResponse = {
    id: number;
    name: string;
    amount: number;
    current: number;
    percentage: number;
    /**
 * 💡 Convenções de Nomenclatura e Tipagem:
 *
 * 1. snake_case (e.g., created_at, updated_at):
 * - Padrão utilizado para nomes de colunas no Banco de Dados SQL (SQLite).
 * - Ajuda a manter a consistência com o backend/SQL e evita problemas de case-sensitivity.
 *
 * 2. PascalCase (e.g., Date, TargetCreate):
 * - Padrão utilizado para Classes e Tipos em TypeScript/JavaScript.
 * - 'Date' (com D maiúsculo) é a classe nativa que representa a data e hora.
 */
    created_at: Date;
    updated_at: Date;
}


export function useTargetDatabase(){
    const database = useSQLiteContext()

    async function create(data: TargetCreate){
        const statment = await database.prepareAsync(
            "INSERT INTO targets (name, amount) VALUES ($name, $amount)",
        )
        
        statment.executeAsync({
            $name: data.name,
            $amount: data.amount, 
        })
    }

    function listedBySavedValue(){
        return database.getAllAsync<TargetResponse>(`
            SELECT
                targets.id,
                targets.name,
                targets.amount,
                COALESCE (SUM(transactions.amount), 0) AS current,
                COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
                targets.created_at,
                targets.updated_at


            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            GROUP BY targets.id, targets.name, targets.amount
            ORDER BY current DESC
            `)
    }

    function show(id: number){
        return database.getFirstAsync<TargetResponse>(`
            SELECT
                targets.id,
                targets.name,
                targets.amount,
                COALESCE (SUM(transactions.amount), 0) AS current,
                COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
                targets.created_at,
                targets.updated_at


            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            WHERE targets.id = ${id}
            `)
    }

    async function update(data: TargetUpdate){
        const statement = await database.prepareAsync(`
            UPDATE targets SET
                name = $name,
                amount = $amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $id`)

            statement.executeAsync({
                $id: data.id,
                $name: data.name,
                amount: data.amount
            })
    }

    return {create, listedBySavedValue, show, update}
}