<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class AuthenticationController extends Controller
{
    public function checkAuth()
    {
        if (!Auth::check()) {
            return response()->json([
                'result' => false,
                'message' => 'Unauthorized',
            ], 401);
        }
        $user = User::find(Auth::user()->id);
        return response()->json([
            'result' => true,
            'user' => $user,
        ], 200);

    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|exists:users,email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()->toArray()
            ], 422);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            // successfull authentication
            $user = User::find(Auth::user()->id);

            $user_token['token'] = $user->createToken('appToken')->accessToken;

            return response()->json([
                'result' => true,
                ...$user_token,
                'user' => $user,
            ], 200);
        } else {
            // failure to authenticate
            return response()->json([
                'result' => false,
                'message' => 'Password incorrect.',
            ], 401);
        }
    }

    public function destroy(Request $request)
    {
        if (Auth::user()) {
            $request->user()->token()->revoke();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully',
            ], 200);
        }
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'error' => $validator->errors()->all()
            ], 422);
        }
        $request['password'] = Hash::make($request['password']);
        $request['remember_token'] = Str::random(10);
        $user = User::create($request->toArray());
        $token = $user->createToken('Laravel Password Grant Client')->accessToken;
        $response = ['token' => $token];
        
        return response($response, 200);
    }
}
