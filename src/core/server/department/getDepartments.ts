import db from '@/core/db/db'

const getDepartments = async () => {
    const departments = await db.department.get()
    return { departments }
}

export interface getDepartments {
    departments: {
        department: string;
        createdAt: Date;
        updatedAt: Date;
    }[]
}
export default getDepartments