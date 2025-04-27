"use client"

import { useState } from "react"
import { EnhancedCodeEditor } from "@/components/enhanced-code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, BookOpen, FileText, Play, Database } from "lucide-react"

interface SQLEditorProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  readOnly?: boolean
  height?: string
  showDocumentation?: boolean
}

const DEFAULT_SQL_CODE = `-- SQL Example: Creating and querying a database for a simple e-commerce system

-- Create tables
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Insert sample data
INSERT INTO customers (customer_id, first_name, last_name, email)
VALUES 
    (1, 'John', 'Doe', 'john.doe@example.com'),
    (2, 'Jane', 'Smith', 'jane.smith@example.com'),
    (3, 'Robert', 'Johnson', 'robert.johnson@example.com');

INSERT INTO products (product_id, name, description, price, stock_quantity)
VALUES 
    (1, 'Laptop', 'High-performance laptop', 1299.99, 10),
    (2, 'Smartphone', 'Latest smartphone model', 799.99, 15),
    (3, 'Headphones', 'Noise-cancelling headphones', 199.99, 20),
    (4, 'Tablet', '10-inch tablet', 499.99, 8);

INSERT INTO orders (order_id, customer_id, total_amount, status)
VALUES 
    (1, 1, 1299.99, 'completed'),
    (2, 2, 999.98, 'shipped'),
    (3, 3, 199.99, 'processing'),
    (4, 1, 499.99, 'pending');

INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price)
VALUES 
    (1, 1, 1, 1, 1299.99),
    (2, 2, 2, 1, 799.99),
    (3, 2, 3, 1, 199.99),
    (4, 3, 3, 1, 199.99),
    (5, 4, 4, 1, 499.99);

-- Query: Get all customers with their orders
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    COUNT(o.order_id) AS order_count,
    SUM(o.total_amount) AS total_spent
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
GROUP BY 
    c.customer_id, c.first_name, c.last_name
ORDER BY 
    total_spent DESC;

-- Query: Get order details with product information
SELECT 
    o.order_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    o.order_date,
    o.status,
    p.name AS product_name,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS item_total
FROM 
    orders o
JOIN 
    customers c ON o.customer_id = c.customer_id
JOIN 
    order_items oi ON o.order_id = oi.order_id
JOIN 
    products p ON oi.product_id = p.product_id
ORDER BY 
    o.order_date DESC;
`

export function SQLEditor({
  initialCode = DEFAULT_SQL_CODE,
  onCodeChange,
  readOnly = false,
  height = "300px",
  showDocumentation = true,
}: SQLEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("editor")

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }

  const handleRunCode = async (codeToRun: string) => {
    setOutput(null)
    setError(null)

    try {
      // In a real implementation, this would execute the SQL queries
      // For now, we'll just simulate execution
      setOutput(
        "Simulated SQL execution output:\n\n" +
          "Tables created successfully.\n\n" +
          "3 rows inserted into customers.\n" +
          "4 rows inserted into products.\n" +
          "4 rows inserted into orders.\n" +
          "5 rows inserted into order_items.\n\n" +
          "Query 1 Results:\n" +
          "customer_id | first_name | last_name | order_count | total_spent\n" +
          "------------+------------+-----------+-------------+------------\n" +
          "1           | John       | Doe       | 2           | 1799.98\n" +
          "2           | Jane       | Smith     | 1           | 999.98\n" +
          "3           | Robert     | Johnson   | 1           | 199.99\n\n" +
          "Query 2 Results:\n" +
          "order_id | customer_name  | order_date           | status     | product_name | quantity | price    | item_total\n" +
          "---------+----------------+----------------------+------------+--------------+----------+----------+-----------\n" +
          "4        | John Doe       | 2025-04-08 09:15:00 | pending    | Tablet       | 1        | 499.99   | 499.99\n" +
          "3        | Robert Johnson | 2025-04-07 14:30:00 | processing | Headphones   | 1        | 199.99   | 199.99\n" +
          "2        | Jane Smith     | 2025-04-06 10:45:00 | shipped    | Smartphone   | 1        | 799.99   | 799.99\n" +
          "2        | Jane Smith     | 2025-04-06 10:45:00 | shipped    | Headphones   | 1        | 199.99   | 199.99\n" +
          "1        | John Doe       | 2025-04-05 16:20:00 | completed  | Laptop       | 1        | 1299.99  | 1299.99\n",
      )
      return "Execution completed successfully"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const sqlDocumentation = (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">SQL Quick Reference</h3>

      <div>
        <h4 className="font-medium">Basic Queries</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`-- Select all columns from a table
SELECT * FROM employees;

-- Select specific columns
SELECT first_name, last_name, salary FROM employees;

-- Filter with WHERE clause
SELECT * FROM employees WHERE department_id = 10;

-- Sort results
SELECT * FROM employees ORDER BY last_name ASC, first_name DESC;

-- Limit results
SELECT * FROM employees LIMIT 10;`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Joins</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`-- Inner join
SELECT e.employee_id, e.first_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

-- Left join
SELECT e.employee_id, e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;

-- Right join
SELECT e.employee_id, e.first_name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Aggregation</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`-- Count, sum, average, min, max
SELECT 
    department_id,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary,
    SUM(salary) AS total_salary
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Data Manipulation</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`-- Insert data
INSERT INTO employees (employee_id, first_name, last_name, salary)
VALUES (101, 'John', 'Doe', 75000);

-- Update data
UPDATE employees
SET salary = salary * 1.1
WHERE department_id = 20;

-- Delete data
DELETE FROM employees
WHERE employee_id = 101;`}</code>
        </pre>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5" />
          SQL Editor
        </CardTitle>
        <CardDescription>Write, edit, and run SQL queries</CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="output" className="flex items-center gap-1">
              <Terminal className="h-4 w-4" />
              Results
            </TabsTrigger>
            {showDocumentation && (
              <TabsTrigger value="docs" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Docs
              </TabsTrigger>
            )}
          </TabsList>
        </div>
        <CardContent className="pt-3">
          <TabsContent value="editor" className="mt-0">
            <EnhancedCodeEditor
              value={code}
              onChange={handleCodeChange}
              language="sql"
              height={height}
              readOnly={readOnly}
              onRun={handleRunCode}
              filename="query.sql"
            />
          </TabsContent>
          <TabsContent value="output" className="mt-0">
            <div className="bg-black text-green-400 font-mono p-4 rounded-md" style={{ height, overflowY: "auto" }}>
              {error ? (
                <div className="text-red-400">
                  <div className="font-bold">Error:</div>
                  <pre>{error}</pre>
                </div>
              ) : output ? (
                <pre>{output}</pre>
              ) : (
                <div className="text-gray-500 italic">Run the query to see results here</div>
              )}
            </div>
          </TabsContent>
          {showDocumentation && (
            <TabsContent value="docs" className="mt-0">
              <div className="border rounded-md" style={{ height, overflowY: "auto" }}>
                {sqlDocumentation}
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">SQLite 3.39.0</div>
        <Button variant="default" size="sm" onClick={() => handleRunCode(code)} disabled={readOnly}>
          <Play className="h-4 w-4 mr-1" />
          Execute Query
        </Button>
      </CardFooter>
    </Card>
  )
}
