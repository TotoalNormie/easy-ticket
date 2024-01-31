<?php

namespace Database\Seeders;

use App\Models\EventType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EventType::create([
            'type_name' => 'Party',
        ]);
        EventType::create([
            'type_name' => 'Conference',
        ]);
        EventType::create([
            'type_name' => 'Seminar',
        ]);
        EventType::create([
            'type_name' => 'Concert',
        ]);
        EventType::create([
            'type_name' => 'Festival',
        ]);
        EventType::create([
            'type_name' => 'Art Exhibition',
        ]);
        
        EventType::create([
            'type_name' => 'Auction',
        ]);
        EventType::create([
            'type_name' => 'Gala',
        ]);
        EventType::create([
            'type_name' => 'Meetup',
        ]);
        
    }
}
