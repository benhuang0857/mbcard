<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Company;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companies = Company::all();
        return response()->json($companies);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'uid' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'video' => 'nullable|string|max:255',
            'voice' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'line' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $company = Company::create([
            'uid' => $request->uid,
            'name' => $request->name,
            'video' => $request->video,
            'voice' => $request->voice,
            'facebook' => $request->facebook,
            'instagram' => $request->instagram,
            'linkedin' => $request->linkedin,
            'line' => $request->line,
            'description' => $request->description,
            'status' => $request->status ?? true,
        ]);

        return response()->json($company, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $company = Company::findOrFail($id);
        return response()->json($company);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $request->validate([
            'uid' => 'sometimes|string|max:255',
            'name' => 'required|string|max:255',
            'video' => 'nullable|string|max:255',
            'voice' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'line' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $company->update($request->all());

        return response()->json($company);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $company = Company::findOrFail($id);
        $company->delete();
        return response()->json(['message' => 'Company deleted successfully']);
    }
}
