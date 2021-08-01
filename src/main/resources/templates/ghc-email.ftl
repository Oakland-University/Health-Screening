<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        table {
            border-spacing: 0;
        }

        td {
            border: 1px solid #dddddd;
            padding: 8px;
        }

        tr:nth-child(even){background-color: #f2f2f2;}

        th {
            text-align: left;
            background-color: #877148;
            color: white;
            border: 1px solid #dddddd;
            padding: 8px;
        }
    </style>
</head>
<body>
    <#if info.shouldStayHome()>
        <p>
            A potential positive self-screening response was submitted by a ${info.accountType!}
        </p>
    <#else>
        <p>
            A health screening <strong>correction</strong> was submitted by a ${info.accountType!"student"}
        </p>
    </#if>
    <p>
        Information about this person:
    </p>
    <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Exposed</th>
            <th>Symptomatic</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>${info.name}</td>
            <td>${info.phone}</td>
            <td>${info.email}</td>
            <td>${info.exposed}</td>
            <td>${info.symptomatic}</td>
        </tr>
        </tbody>
    </table>
</body>
</html>
