<?php

namespace App\Admin\Controllers;

use App\Member;
use App\Role;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;
use Encore\Admin\Admin;
use Hash;

class MemberController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Member';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Member());

        $grid->column('id', '編號');
        $grid->column('name', '姓名');
        $grid->column('account', '帳號');

        // 顯示 Role 名稱，而不是 role_id
        $grid->column('role_id', '角色')->display(function ($roleId) {
            return Role::find($roleId)->name ?? '未知';
        });

        $grid->column('mobile', '手機號碼');
        $grid->column('email', '電子郵件');

        // Avatar 顯示圖片（加大為 100x100）
        $grid->column('avatar', '頭像')->image('/storage/', 100, 100);

        // Banner 顯示圖片（加大為 200x100）
        $grid->column('banner', '橫幅圖片')->image('/storage/', 200, 100);

        $grid->column('birth_day', '生日');
        $grid->column('address', '地址');

        // Description 長文字換行
        $grid->column('description', '描述')->display(function ($text) {
            $maxLength = 100; // 最多顯示 100 個字
            return "<div style='white-space: normal; word-break: break-word; max-width: 400px;'>
                        " . (mb_strlen($text) > $maxLength ? mb_substr($text, 0, $maxLength) . '...' : $text) . "
                    </div>";
        })->style('max-width: 400px; white-space: normal; word-wrap: break-word;');
        

        // 顯示 status 為 true/false
        $grid->column('status', '狀態')->display(function ($status) {
            return $status ? '啟用' : '停用';
        });

        return $grid;
    }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(Member::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('name', __('Name'));
        $show->field('account', __('Account'));
        $show->field('password', __('Password'));
        $show->field('role_id', __('Role id'));
        $show->field('mobile', __('Mobile'));
        $show->field('email', __('Email'));
        $show->field('avatar', __('Avatar'));
        $show->field('banner', __('Banner'));
        $show->field('birth_day', __('Birth day'));
        $show->field('address', __('Address'));
        $show->field('description', __('Description'));
        $show->field('status', __('Status'));
        $show->field('remember_token', __('Remember token'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new Member());

        $form->text('name', __('Name'))->required();
        $form->text('account', __('Account'));
        $form->password('password', __('Password'))->required();
        
        // 選擇 Role
        $form->select('role_id', __('Role'))
            ->options(Role::pluck('name', 'id'))
            ->required()
            ->when('change', function ($form) {
                // 當 role_id 變更時，透過 AJAX 更新 account
                return response()->json([
                    'account' => ''
                ]);
            });

        // 手機號碼
        $form->text('mobile', __('Mobile'))
            ->rules(['required', 'regex:/^09\d{8}$/'])
            ->attribute('autocomplete', 'off')
            ->required();
        $form->email('email', __('Email'));
        $form->image('avatar', __('Avatar'));
        $form->image('banner', __('Banner'));
        $form->date('birth_day', __('Birth day'))->default(date('Y-m-d'));
        $form->text('address', __('Address'));
        $form->textarea('description', __('Description'));
        $form->switch('status', __('Status'))->default(1)->required();

        $form->saving(function (Form $form) {
            if ($form->password) {
                $form->password = Hash::make($form->password);
            }
        
            // 只有當 account 為空時，才自動生成
            if (empty($form->account) && $form->role_id) {
                $role = Role::find($form->role_id);
                if ($role) {
                    $len = $role->length;
                    $roleName = strtolower($role->slug); // 轉小寫
                    $id = 1;
        
                    // 檢查是否有重複的 account，確保唯一
                    do {
                        $account = $roleName . str_pad($id, $len, '0', STR_PAD_LEFT);
                        $id++;
                    } while (Member::where('account', $account)->exists());
        
                    $form->account = $account;
                }
            }
        });
        

        Admin::script("
            $(document).ready(function() {
                $('select[name=\"role_id\"]').on('change', function() {
                    var roleId = $(this).val();
                    if (!roleId) return;

                    $.ajax({
                        url: '/api/get-role-info/' + roleId,
                        type: 'GET',
                        success: function(response) {
                            if (response.name && response.length) {
                                var userId = $('input[name=\"id\"]').val() || 1;
                                var paddedId = String(userId).padStart(response.length, '0');
                                var account = response.name.toLowerCase() + paddedId;

                                if (!$('input[name=\"account\"]').val()) {
                                    $('input[name=\"account\"]').val(account);
                                }
                            }
                        }
                    });
                });
            });
        ");

        return $form;
    }
}
