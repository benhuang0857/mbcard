<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Member;
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
            'account' => 'required|string|unique:members,account|max:255',
            'password' => 'required|string|min:6',
            'mobile' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'avatar' => 'nullable|string|max:255',
            'banner' => 'nullable|string|max:255',
            'birth_day' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $avatarPath = $request->hasFile('avatar') ? $request->file('avatar')->store('uploads/avatars', 'public') : null;
        $bannerPath = $request->hasFile('banner') ? $request->file('banner')->store('uploads/banners', 'public') : null;

        $member = Member::create([
            'name' => $request->name,
            'account' => $request->account,
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
    public function show($id)
    {
        $member = Member::with(['portfolio', 'companies'])->findOrFail($id);
        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'account' => 'sometimes|string|unique:members,account,' . $id . '|max:255',
            'password' => 'sometimes|string|min:6',
            'mobile' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'avatar' => 'nullable|string|max:255',
            'banner' => 'nullable|string|max:255',
            'birth_day' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        if ($request->has('password')) {
            $member->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('uploads/avatars', 'public');
            $member->avatar = $avatarPath;
        }
    
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('uploads/banners', 'public');
            $member->banner = $bannerPath;
        }

        $member->update($request->except(['password', 'avatar', 'banner']));

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

        return response()->json($member->load('portfolio', 'companies'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $member = Member::findOrFail($id);
        $member->delete();
        return response()->json(['message' => 'Member deleted successfully']);
    }
}
