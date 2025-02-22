<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    /**
     * 1.black0000 從0000開始，依序編號 (例如：black0001、black0002）
     * 2.silver0000 從0000開始，依序編號 (例如：silver0001、silver0002）
     * 3.glod000 從000 開始，依序編號 (例如：glod001、glod0002）
     * 4.diamond000 從000 開始，依序編號 (例如：diamond001、diamond0002）
     * Note: gold與diamond兩個的流水編號只有三位數
     */
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('slug'); // black, silver, glod, diamond
            $table->integer('length');
            $table->boolean('status')->default(true);
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
        Schema::dropIfExists('roles');
    }
}
