<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    // W9 でログインに使う学生3人。W6 の ReviewSeeder の学生と同じ人（2回実行しても増えない）
    // パスワードはどの人も password123（User モデルが hashed で保存する）
    private const STUDENTS = [
        'student1@example.com' => '青木 さくら',
        'student2@example.com' => '内田 蓮',
        'student3@example.com' => '工藤 陽菜',
    ];

    public function run(): void
    {
        foreach (self::STUDENTS as $email => $name) {
            User::updateOrCreate(['email' => $email], ['name' => $name, 'password' => 'password123']);
        }
    }
}
