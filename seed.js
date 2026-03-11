const mongoose = require('mongoose');

const Role = require('./schemas/roles');
const User = require('./schemas/users');
const { dataRole, dataUser } = require('./utils/data');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marzo_1103';

async function seedRoles() {
    const roleIdMap = new Map();

    for (const role of dataRole) {
        const savedRole = await Role.findOneAndUpdate(
            { name: role.name },
            {
                name: role.name,
                description: role.description || '',
                isDeleted: false,
                createdAt: role.creationAt ? new Date(role.creationAt) : undefined,
                updatedAt: role.updatedAt ? new Date(role.updatedAt) : undefined
            },
            {
                returnDocument: 'after',
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
                overwriteDiscriminatorKey: false
            }
        );

        roleIdMap.set(role.id, savedRole._id);
    }

    return roleIdMap;
}

async function seedUsers(roleIdMap) {
    for (const user of dataUser) {
        const mappedRoleId = roleIdMap.get(user.role.id);

        if (!mappedRoleId) {
            throw new Error(`Khong tim thay role mapping cho ${user.role.id}`);
        }

        await User.findOneAndUpdate(
            { username: user.username },
            {
                username: user.username,
                password: user.password,
                email: user.email,
                fullName: user.fullName || '',
                avatarUrl: user.avatarUrl || 'https://i.sstatic.net/l60Hf.png',
                status: Boolean(user.status),
                role: mappedRoleId,
                loginCount: Number.isInteger(user.loginCount) ? user.loginCount : 0,
                isDeleted: false,
                createdAt: user.creationAt ? new Date(user.creationAt) : undefined,
                updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined
            },
            {
                returnDocument: 'after',
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
                overwriteDiscriminatorKey: false
            }
        );
    }
}

async function seedData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Da ket noi MongoDB');

        const roleIdMap = await seedRoles();
        await seedUsers(roleIdMap);

        console.log(`Da seed ${dataRole.length} role va ${dataUser.length} user thanh cong`);
    } catch (error) {
        console.error('Seed that bai:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedData();