<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{
    use HasFactory;
    protected $fillable = ['event_id', 'ticket_name', 'seats', 'price'];

    public function event()
    {
        $this->belongsTo(Event::class);
    }
}
