<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventTicket extends Model
{
    use HasFactory;

    public function orderedTickets()
    {
        return $this->hasMany(OrderedTicket::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
