<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Member;
use App\Portfolio;
use App\Company;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // 產生 10 個會員
        for ($i = 0; $i < 10; $i++) {
            $member = Member::create([
                'name' => 'User ' . ($i + 1),
                'account' => 'user' . ($i + 1),
                'password' => Hash::make('password'),
                'mobile' => '090000000' . $i,
                'email' => 'user' . ($i + 1) . '@example.com',
                'avatar' => null,
                'banner' => null,
                'birth_day' => '2000-01-01',
                'address' => 'Address ' . ($i + 1),
                'description' => 'This is user ' . ($i + 1),
                'status' => true,
            ]);

            // 為該會員建立 Portfolio
            Portfolio::create([
                'uid' => $member->account,
                'bg_color' => '#ffffff',
                'video' => null,
                'voice' => null,
                'facebook' => null,
                'instagram' => null,
                'linkedin' => null,
                'line' => null,
            ]);

            // 為該會員建立 2 個 Company
            for ($j = 0; $j < 2; $j++) {
                Company::create([
                    'uid' => $member->id,
                    'name' => 'Company-' . $j,
                    'video' => null,
                    'voice' => null,
                    'facebook' => null,
                    'instagram' => null,
                    'linkedin' => null,
                    'line' => null,
                    'description' => 'Company ' . ($j + 1) . ' for user ' . ($i + 1),
                    'status' => true,
                ]);
            }
        }
    }
}
