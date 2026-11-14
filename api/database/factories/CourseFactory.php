<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

// W11：テストで使う授業を作る。CourseFactory::new()->create([...]) のように使い、テストに関係する列だけを上書きする
// Course モデルには HasFactory を付けていないので、Course::factory() ではなく CourseFactory::new() と書く
/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        return [
            // 授業コードの決まり（英大文字2〜3文字と数字3つ）に合い、初期データの授業とは重ならないコード
            'code' => 'TS' . fake()->unique()->numberBetween(100, 999),
            'name' => 'テスト用の授業',
            'teacher' => fake()->name(),
            'day' => fake()->numberBetween(1, 5),
            'period' => fake()->numberBetween(1, 6),
            'room' => fake()->randomElement(['A101', 'B102', 'C201', 'J302']),
            'credits' => 2,
            'required' => false,
        ];
    }
}
