const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    // Create default admin user
    const passwordHash = await bcrypt.hash('admin123', 12);

    const admin = await prisma.spcAdmin.upsert({
        where: { email: 'admin@jmi.ac.in' },
        update: {},
        create: {
            name: 'SPC Admin',
            email: 'admin@jmi.ac.in',
            passwordHash,
            phone: '+91-9876543210',
        },
    });

    console.log('✅ Seeded admin user:', admin.email);

    // Create sample upcoming companies
    const upcoming1 = await prisma.upcomingCompany.create({
        data: {
            name: 'Google India',
            tentativeDate: new Date('2026-03-15'),
            info: 'Eligibility: CS/IT branches, CGPA >= 7.5. Roles: SDE Intern, SDE-1. Batch: 2026.',
            createdBy: admin.id,
        },
    });

    const upcoming2 = await prisma.upcomingCompany.create({
        data: {
            name: 'Infosys',
            tentativeDate: new Date('2026-03-22'),
            info: 'All branches eligible. CGPA >= 6.0. Role: Systems Engineer. CTC: 3.6 LPA.',
            createdBy: admin.id,
        },
    });

    console.log('✅ Seeded upcoming companies:', upcoming1.name, upcoming2.name);

    // Create sample ongoing drives
    const ongoing1 = await prisma.ongoingDrive.create({
        data: {
            name: 'Microsoft',
            jd: 'Role: SDE-1 | Location: Hyderabad | CTC: 18 LPA | Skills: DSA, System Design, C++/Java',
            status: 'round',
            currentRound: 'Technical Interview Round 2',
            roundNumber: 2,
            totalRounds: 4,
            createdBy: admin.id,
        },
    });

    const ongoing2 = await prisma.ongoingDrive.create({
        data: {
            name: 'TCS Digital',
            jd: 'Role: Digital Engineer | Location: PAN India | CTC: 7 LPA | Skills: Full Stack, Cloud',
            status: 'gform',
            gformLink: 'https://forms.google.com/example-tcs',
            gformDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            createdBy: admin.id,
        },
    });

    console.log('✅ Seeded ongoing drives:', ongoing1.name, ongoing2.name);

    // Create sample completed drive
    const completed1 = await prisma.completedDrive.create({
        data: {
            name: 'Wipro',
            jd: 'Role: Project Engineer | Location: Bangalore | CTC: 3.5 LPA',
            selectedCount: 12,
            spcMemberName: 'Ahmed Khan',
            spcMemberPhone: '+91-9988776655',
            spcMemberEmail: 'ahmed.khan@jmi.ac.in',
            finalListUrl: 'https://drive.google.com/example-final-list',
            finalListName: 'Wipro_Shortlisted_2026.pdf',
            selectedListUrl: 'https://drive.google.com/example-selected',
            selectedListName: 'Wipro_Selected_2026.pdf',
            createdBy: admin.id,
        },
    });

    console.log('✅ Seeded completed drives:', completed1.name);
    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin login: admin@jmi.ac.in / admin123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
