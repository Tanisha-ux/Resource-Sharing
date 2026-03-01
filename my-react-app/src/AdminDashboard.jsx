

import './index.css';

function AdminDashboard() {
  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Admin</h2>
        <ul>
          <li>Dashboard</li>
          <li>All Resources</li>
          <li>Pending</li>
          <li>Users</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        {/* Topbar */}
        <div className="topbar">
          <h1>Admin Dashboard</h1>
          <button className="logout-btn">Logout</button>
        </div>

        {/* Stats Cards */}
        <div className="stats">
          <div className="card">
            <h3>Total Resources</h3>
            <p>120</p>
          </div>
          <div className="card">
            <h3>Pending</h3>
            <p>8</p>
          </div>
          <div className="card">
            <h3>Approved</h3>
            <p>112</p>
          </div>
          <div className="card">
            <h3>Users</h3>
            <p>45</p>
          </div>
        </div>

        {/* Resource Table */}
        <div className="table-container">
          <h2>Pending Resources</h2>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>OS Notes</td>
                <td>Notes</td>
                <td>Tanisha</td>
                <td>Pending</td>
                <td>
                  <button className="approve">Approve</button>
                  <button className="reject">Reject</button>
                </td>
              </tr>

              <tr>
                <td>AI PPT</td>
                <td>Lecture</td>
                <td>Rahul</td>
                <td>Pending</td>
                <td>
                  <button className="approve">Approve</button>
                  <button className="reject">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;