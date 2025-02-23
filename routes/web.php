<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', 'PageController@login');
Route::get('/member/{account}', 'PageController@bcard');
Route::get('/admin/member', 'PageController@member');

// find password
Route::get('/findpassword', function () {
    return view('_login/findpassword');
});

Route::get('/api/get-role-info/{id}', function ($id) {
    $role = Role::find($id);
    if (!$role) {
        return response()->json(['error' => 'Role not found'], 404);
    }

    return response()->json([
        'name' => $role->slug,
        'length' => $role->length
    ]);
});
