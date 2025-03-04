<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMemberFavoritesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('member_favorites', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('member_id'); // 收藏者
            $table->unsignedInteger('favorite_member_id'); // 被收藏的會員
            $table->timestamps();

            // 設定外鍵關聯
            $table->foreign('member_id')->references('id')->on('members')->onDelete('cascade');
            $table->foreign('favorite_member_id')->references('id')->on('members')->onDelete('cascade');

            // 避免重複收藏
            $table->unique(['member_id', 'favorite_member_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('member_favorites');
    }
}
