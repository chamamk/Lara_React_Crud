<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\Category;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Task::with('category')->paginate(10);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTaskRequest $request)
    {
        $task=Task::create([
            'title'=>$request->title,
            'body'=>$request->body,
            'category_id'=>$request->category_id,
        ]);
        return $task;
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return $task;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update([
            'title'=>$request->title,
            'body'=>$request->body,
            'category_id'=>$request->category_id,
            'done'=>$request->done,
        ]);
        return $task;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return ['message','Task est supprimé avec success'];
    }

    public function getTaskByCategory(Category $category){
        return $category->tasks()->with('category')->paginate(4);
    }

    public function getTasksOrderBy($column, $direction){
        return Task::with('category')->orderBy($column, $direction)->paginate(10);
    }

    public function getTaskByTerm($term){
        $tasks= Task::with('category')
            ->where('title','like','%'.$term.'%')
            ->orWhere('body','like','%'.$term.'%')
            ->orWhere('id','like','%'.$term.'%')
            ->paginate(5);
            return $tasks;
    }
}
