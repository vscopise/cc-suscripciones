import bcryptjs from 'bcryptjs';

interface SeedUser {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}

interface SeedData {
    users: SeedUser[];
}

export const initialData: SeedData = {
    users: [
        { name: 'Vicente', email: 'vscopise@gmail.com', password: bcryptjs.hashSync('123456'), role: 'admin', },
        { name: 'Evangelina', email: 'eviscyc@gmail.com', password: bcryptjs.hashSync('123456'), role: 'user', },
    ]
}