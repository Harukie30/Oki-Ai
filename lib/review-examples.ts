import type { CodeLanguage } from "@/lib/review-types"

/**
 * Short, intentionally imperfect snippets so first-time users
 * can try a review without pasting their own code.
 */
export const REVIEW_EXAMPLES: Record<CodeLanguage, string> = {
  typescript: `function getUser(id: string) {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  // missing null check and typed return
  return users.find((u: any) => u.id == id)
}

export async function loadProfile(userId: string) {
  const user = getUser(userId)
  console.log("loaded", user.name)
  return fetch("/api/profile/" + userId).then((r) => r.json())
}
`,

  javascript: `function total(cart) {
  let sum = 0
  for (var i = 0; i <= cart.length; i++) {
    sum += cart[i].price
  }
  return sum
}

async function checkout(cart) {
  const amount = total(cart)
  eval("window.lastTotal = " + amount)
  return fetch("/pay", { method: "POST", body: amount })
}
`,

  python: `def get_user(users, user_id):
    for u in users:
        if u["id"] == user_id:
            return u
    # falls through with None, callers assume a dict

def render_profile(users, user_id):
    user = get_user(users, user_id)
    print("Hello " + user["name"])
    return f"<h1>{user['name']}</h1>"
`,

  go: `package main

import "fmt"

func Find(items []string, target string) string {
	for i := 0; i <= len(items); i++ {
		if items[i] == target {
			return items[i]
		}
	}
	return ""
}

func main() {
	fmt.Println(Find([]string{"a", "b"}, "c"))
}
`,

  java: `import java.util.*;

public class Users {
  public static String findName(List<String> names, int index) {
    return names.get(index).toUpperCase();
  }

  public static void main(String[] args) {
    List<String> names = null;
    System.out.println(findName(names, 0));
  }
}
`,

  csharp: `using System;
using System.Collections.Generic;

class Users {
  public static string Find(List<string> names, int index) {
    return names[index].ToUpper();
  }

  static void Main() {
    List<string> names = null;
    Console.WriteLine(Find(names, 0));
  }
}
`,

  php: `<?php
function find_user($users, $id) {
  foreach ($users as $user) {
    if ($user['id'] == $id) {
      return $user;
    }
  }
}

function greet($users, $id) {
  $user = find_user($users, $id);
  echo "Hello " . $user['name'];
}
`,

  ruby: `def find_user(users, id)
  users.each do |user|
    return user if user[:id] == id
  end
  nil
end

def greet(users, id)
  user = find_user(users, id)
  puts "Hello #{user[:name]}"
end
`,

  kotlin: `fun findName(names: List<String>?, index: Int): String {
    return names!![index].uppercase()
}

fun main() {
    val names: List<String>? = null
    println(findName(names, 0))
}
`,

  scala: `object Users {
  def findName(names: List[String], index: Int): String =
    names(index).toUpperCase

  def main(args: Array[String]): Unit = {
    val names: List[String] = null
    println(findName(names, 0))
  }
}
`,

  rust: `fn find(items: &[String], target: &str) -> &str {
    for i in 0..=items.len() {
        if items[i] == target {
            return &items[i];
        }
    }
    ""
}

fn main() {
    let items = vec!["a".to_string(), "b".to_string()];
    println!("{}", find(&items, "c"));
}
`,

  c: `#include <stdio.h>
#include <string.h>

const char* find(const char** items, int n, const char* target) {
  for (int i = 0; i <= n; i++) {
    if (strcmp(items[i], target) == 0) {
      return items[i];
    }
  }
  return NULL;
}

int main(void) {
  const char* items[] = {"a", "b"};
  printf("%s\\n", find(items, 2, "c"));
  return 0;
}
`,

  cpp: `#include <iostream>
#include <vector>
#include <string>

std::string find(const std::vector<std::string>& items, const std::string& target) {
  for (size_t i = 0; i <= items.size(); i++) {
    if (items[i] == target) return items[i];
  }
  return "";
}

int main() {
  std::vector<std::string> items = {"a", "b"};
  std::cout << find(items, "c") << std::endl;
}
`,

  sql: `SELECT u.id, u.name, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.email = 'admin' OR 1=1
ORDER BY o.total;
`,

  bash: `#!/usr/bin/env bash
FILE=$1
# unquoted expansion and missing checks
cat $FILE
rm -rf /tmp/$USER/cache/*
echo "done for $USER"
`,
}

export function getReviewExample(language: CodeLanguage): string {
  return REVIEW_EXAMPLES[language]
}
