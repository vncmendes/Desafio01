import { randomUUID } from "node:crypto";
import { Database } from "../database/localStorage.js";
import { buildRoutePath } from "../utils/buildRoutePath.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler(req, res) {
      const { title, description } = req.body
      if (!title || !description) {
        return res
          .writeHead(401)
          .end("Error, insuficient information for request !");
      }
      else {

        const task = {
          id: randomUUID(),
          title: title,
          description: description,
          created_at: Date.now(),
          updated_at: Date.now(),
          completed_at: null,
        }

        database.create("tasks", task);

        return res
          .writeHead(201)
          .end();
        }
      }
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const search = req.query;
      const { title, description } = search;

      if (!title && !description) {
        const tasks = database.read("tasks");

        return res.end(JSON.stringify(tasks));
      }

      if (search) {
        const tasks = database.read("tasks", search ? {
          title: title,
          description: description
        } : null);

        return res.end(JSON.stringify(tasks));
      }
    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler(req, res) {
      const { id } = req.params;
      const { title, description } = req.body;

      const tasks = database.read("tasks").some(row => row.id === id);

      if (!tasks) {
        return res
          .writeHead(401)
          .end("Unauthorized, Task not found !")
      }
      else {
        const currentTask = database.read("tasks").filter(row => row.id === id);  

        const previousTitle = currentTask[0].title;
        const previousDescription = currentTask[0].description;
        const creationDate = currentTask[0].created_at;
        const previousCompleted_at = currentTask[0].completed_at;
        
        if (!title) {
          database.put("tasks", id, {
            title: previousTitle, 
            description: description,
            created_at: creationDate,
            updated_at: Date.now(),
            completed_at: previousCompleted_at
          });
    
          return res
            .writeHead(204)
            .end();
        }

        if (!description) {
          database.put("tasks", id, {
            title: title, 
            description: previousDescription,
            created_at: creationDate,
            updated_at: Date.now(),
            completed_at: previousCompleted_at
          });
    
          return res
            .writeHead(204)
            .end();
        }

        database.put("tasks", id, {
          title: title, 
          description: description,
          created_at: creationDate,
          updated_at: Date.now(),
          completed_at: previousCompleted_at
        });

        return res
          .writeHead(204)
          .end();
      }
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const { completed_at } = req.body;

      const task = database.read("tasks").some(row => row.id === id);

      if (!task) {
        return res
          .writeHead(401)
          .end("Unauthorized, Task not found !")
      }
      else {
        const oldInformations = database.read("tasks").filter(row => row.id === id);  
        console.log(oldInformations);
        
        const creationDate = oldInformations[0].created_at;
        const previousTitle = oldInformations[0].title;
        const previousDescription = oldInformations[0].description;

        database.patch("tasks", id, {
          title: previousTitle, 
          description: previousDescription,
          created_at: creationDate,
          updated_at: Date.now(),
          completed_at: completed_at === true ? Date.now() : null
        });

        return res
          .writeHead(204)
          .end();
      }
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.read("tasks").some(row => row.id === id);
      console.log(tasks);
      
      if (!tasks) {
        return res
          .writeHead(401)
          .end("Unauthorized, Task not found !")
      }

      database.delete("tasks", id);

      return res
        .writeHead(204)
        .end();
    }
  },
]