<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Member;
use App\Role;
use App\Company;
use App\Portfolio;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    public function me(Request $request)
    {
        $token = $request->bearerToken();
        $member = Member::with(['portfolio', 'companies'])
            ->where('remember_token', $token)->first();

        if (!$member) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json($member);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $members = Member::with(['portfolio', 'companies'])->get();
        return response()->json($members);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'role_id' => 'required|integer',
            'mobile' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'avatar' => 'nullable|string|max:255',
            'banner' => 'nullable|string|max:255',
            'birth_day' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        // 取得角色
        $role = Role::findOrFail($request->role_id);

        // 查找該角色下的最大 account
        $latestMember = Member::where('role_id', $role->id)
                            ->where('account', 'LIKE', $role->slug . '%') // 確保 account 以 role_name 開頭
                            ->orderBy('account', 'desc')
                            ->first();

        // 取得最新的流水號
        if ($latestMember) {
            // 從 account 提取數字部分
            $lastSerial = (int) substr($latestMember->account, strlen($role->slug));
        } else {
            $lastSerial = 0;
        }

        // 新增流水號
        $newSerial = $lastSerial + 1;

        // 格式化流水號
        $formattedSerial = str_pad($newSerial, $role->length, '0', STR_PAD_LEFT);

        // 生成會員帳號
        $account = $role->slug . $formattedSerial;

        $avatarPath = $request->hasFile('avatar') ? $request->file('avatar')->store('uploads/avatars', 'public') : null;
        $bannerPath = $request->hasFile('banner') ? $request->file('banner')->store('uploads/banners', 'public') : null;

        $member = Member::create([
            'name' => $request->name,
            'account' => $account,
            'password' => Hash::make($request->password),
            'mobile' => $request->mobile,
            'email' => $request->email,
            'avatar' => $avatarPath,
            'banner' => $bannerPath,
            'birth_day' => $request->birth_day ?? '1000-01-01',
            'address' => $request->address,
            'description' => $request->description,
            'status' => $request->status ?? true,
        ]);

        if ($request->has('portfolio')) {
            $member->portfolio()->create([
                'uid' => $member->account,
                'bg_color' => $request->portfolio['bg_color'] ?? null,
                'video' => $request->portfolio['video'] ?? null,
                'voice' => $request->portfolio['voice'] ?? null,
                'facebook' => $request->portfolio['facebook'] ?? null,
                'instagram' => $request->portfolio['instagram'] ?? null,
                'linkedin' => $request->portfolio['linkedin'] ?? null,
                'line' => $request->portfolio['line'] ?? null,
            ]);
        }

        if ($request->has('companies')) {
            foreach ($request->companies as $companyData) {
                $company = $member->companies()->updateOrCreate(
                    ['uid' => $member->account, 'id' => $companyData['id'] ?? null],
                    [
                        'video' => $companyData['video'] ?? null,
                        'voice' => $companyData['voice'] ?? null,
                        'facebook' => $companyData['facebook'] ?? null,
                        'instagram' => $companyData['instagram'] ?? null,
                        'linkedin' => $companyData['linkedin'] ?? null,
                        'line' => $companyData['line'] ?? null,
                        'description' => $companyData['description'] ?? null,
                        'status' => $companyData['status'] ?? true,
                    ]
                );
            }
        }
    
        return response()->json($member->load('portfolio', 'companies'), 201);
    }    

    /**
     * Display the specified resource.
     */
    public function show($account)
    {
        $member = Member::with(['portfolio', 'companies'])
                    ->where('account', $account)->first();
        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $account)
    {
        // 查找會員
        $member = Member::where('account', $account)->first();
    
        if (!$member) {
            return response()->json(['error' => '會員不存在'], 404);
        }
    
        // 驗證請求
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'account' => 'sometimes|string|unique:members,account,' . $member->id . '|max:255',
            'password' => 'sometimes|string|min:6',
            'role_id' => 'sometimes|integer|exists:roles,id',
            'mobile' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'avatar' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:2048',
            'birth_day' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);
    
        // 如果角色變更，需要更新 `account`
        if ($request->has('role_id') && $request->role_id != $member->role_id) {
            $newRole = Role::findOrFail($request->role_id);
    
            // 找到該角色下的最大流水號
            $latestMember = Member::where('role_id', $newRole->id)
                ->where('account', 'LIKE', $newRole->name . '%')
                ->orderBy('account', 'desc')
                ->first();
    
            $lastSerial = $latestMember ? (int) substr($latestMember->account, strlen($newRole->name)) : 0;
            $newSerial = $lastSerial + 1;
            $formattedSerial = str_pad($newSerial, $newRole->length, '0', STR_PAD_LEFT);
            $newAccount = $newRole->name . $formattedSerial;
    
            $member->account = $newAccount;
            $member->role_id = $newRole->id;
        }
    
        // 更新密碼（如果有）
        if ($request->has('password')) {
            $member->password = Hash::make($request->password);
        }
    
        // 更新 `avatar`（如果有上傳）
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('uploads/avatars', 'public');
            $member->avatar = $avatarPath;
        }
    
        // 更新 `banner`（如果有上傳）
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('uploads/banners', 'public');
            $member->banner = $bannerPath;
        }
    
        // 其他欄位更新
        $member->fill($request->except(['password', 'avatar', 'banner', 'role_id', 'account']));
        $member->save();
    
        // 更新 `portfolio`
        if ($request->has('portfolio')) {
            $portfolioData = [
                'bg_color' => $request->portfolio['bg_color'] ?? null,
                'video' => $request->portfolio['video'] ?? null,
                'voice' => $request->portfolio['voice'] ?? null,
                'facebook' => $request->portfolio['facebook'] ?? null,
                'instagram' => $request->portfolio['instagram'] ?? null,
                'linkedin' => $request->portfolio['linkedin'] ?? null,
                'line' => $request->portfolio['line'] ?? null,
            ];
    
            if ($member->portfolio) {
                $member->portfolio->update($portfolioData);
            } else {
                $member->portfolio()->create(array_merge(['uid' => $member->account], $portfolioData));
            }
        }
    
        // 更新 `companies`
        if ($request->has('companies')) {
            foreach ($request->companies as $companyData) {
                $member->companies()->updateOrCreate(
                    ['uid' => $member->account, 'id' => $companyData['id'] ?? null],
                    [
                        'video' => $companyData['video'] ?? null,
                        'voice' => $companyData['voice'] ?? null,
                        'facebook' => $companyData['facebook'] ?? null,
                        'instagram' => $companyData['instagram'] ?? null,
                        'linkedin' => $companyData['linkedin'] ?? null,
                        'line' => $companyData['line'] ?? null,
                        'description' => $companyData['description'] ?? null,
                        'status' => $companyData['status'] ?? true,
                    ]
                );
            }
        }
    
        return response()->json($member->load('portfolio', 'companies'));
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $member = Member::where('account', $account)->first();
        $member->delete();
        return response()->json(['message' => 'Member deleted successfully']);
    }
}
