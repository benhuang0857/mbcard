<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('members', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('account')->unique(); // card id: role + serial_number(to string)
            $table->string('password');
            $table->integer('role_id')->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->nullable();
            $table->string('avatar')->nullable();
            $table->string('banner')->nullable();
            $table->date('birth_day')->default('1000-01-01');
            $table->string('address')->nullable();
            $table->text('description')->nullable();
            $table->boolean('status')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('members');
    }
}
