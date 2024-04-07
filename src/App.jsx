import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AuthValidator from "./components/auth/AuthValidator";
import RolValidator from "./components/auth/RolValidator";
import RegisterUser from "./pages/admin/User/RegisterUser";
import Users from "./pages/admin/User/Users";
import MainSection from "./pages/MainSection";
import EditUser from "./pages/admin/User/EditUser";
import TeachersA from "./pages/admin/Teacher/Teachers";
import Settings from "./pages/Settings";
import RegisterTeacherA from "./pages/admin/Teacher/RegisterTeacher";
import EditTeacherA from "./pages/admin/Teacher/EditTeacher";
import Students from "./pages/admin/Student/Students";
import EditStudent from "./pages/admin/Student/EditStudent";
import RegisterStudent from "./pages/admin/Student/RegisterStudent";
import Subjects from "./pages/admin/Subject/Subjects";
import EditSubject from "./pages/admin/Subject/EditSubject";
import RegisterSubject from "./pages/admin/Subject/RegisterSubject";
import Parents from "./pages/admin/Parent/Parents";
import EditParent from "./pages/admin/Parent/EditParent";
import RegisterParent from "./pages/admin/Parent/RegisterParent";
import Perfile from "./pages/Perfile";
import Chats from "./pages/Chat/Chats";
import Assists from "./pages/teacher/SchoolAssists/Assists";
import TeacherGrades from "./pages/teacher/SchoolGrades/Grades";
import RegisterGrades from "./pages/secretary/SchoolGrades/RegisterGrades";
import SecretaryGrades from "./pages/secretary/SchoolGrades/Grades";
import EditGrades from "./pages/secretary/SchoolGrades/EditGrades";
import RegisterPost from "./pages/secretary/SchoolPosts/RegisterPost";
import EditPost from "./pages/secretary/SchoolPosts/EditPost";
import Posts from "./pages/secretary/SchoolPosts/Posts";
import PostsPage from "./pages/Post/PostsPage";
import TeachersS from "./pages/secretary/Teacher/Teachers";
import RegisterTeacherS from "./pages/secretary/Teacher/RegisterTeacher";
import EditTeacherS from "./pages/secretary/Teacher/EditTeacher";
import TeachersVP from "./pages/viceprincipal/Teacher/Teachers";
import RegisterTeacherVP from "./pages/viceprincipal/Teacher/RegisterTeacher";
import EditTeacherVP from "./pages/viceprincipal/Teacher/EditTeacher";
import GradesVP from "./pages/viceprincipal/SchoolGrades/Grades";
import RegisterGradesVP from "./pages/viceprincipal/SchoolGrades/RegisterGrades";
import EditGradesVP from "./pages/viceprincipal/SchoolGrades/EditGrades";
import PostsVP from "./pages/viceprincipal/SchoolPosts/Posts";
import RegisterPostVP from "./pages/viceprincipal/SchoolPosts/RegisterPost";
import EditPostVP from "./pages/viceprincipal/SchoolPosts/EditPost";
import SubjectsVP from "./pages/viceprincipal/Subject/Subjects";
import EditSubjectVP from "./pages/viceprincipal/Subject/EditSubject";
import GradesP from "./pages/principal/SchoolGrades/Grades";
import EventsAC from "./pages/academicCoor/Events/Events";
import EventsG from "./pages/Event/Events";
import CounselorsA from "./pages/admin/Counselor/Counselors";
import RegisterCounselorA from "./pages/admin/Counselor/RegisterCounselor";
import CounselorsV from "./pages/viceprincipal/Counselor/Counselors";
import RegisterCounselorV from "./pages/viceprincipal/Counselor/RegisterCounselor";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<AuthValidator />}>
        <Route element={<Dashboard />}>
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="/perfile" element={<Perfile />} /> */}

          <Route element={<RolValidator rolRoute={["counselor", "parent"]} />}>
            <Route path="/chats" element={<Chats />} />
          </Route>

          <Route path="/" element={<MainSection />} />
          <Route
            element={
              <RolValidator
                rolRoute={[
                  "counselor",
                  "parent",
                  "teacher",
                  "admin",
                  "principal",
                  "academiccoor",
                ]}
              />
            }
          >
            <Route path="/posts" element={<PostsPage />} />
          </Route>
          <Route path="/schedule" element={<EventsG />} />

          <Route element={<RolValidator rolRoute="admin" />}>
            <Route path="/admin/*">
              <Route path="users/*">
                <Route path="" element={<Users />} />
                <Route path="edit/:id" element={<EditUser />} />
                <Route path="register" element={<RegisterUser />} />
                <Route path="*" element={<Navigate to="/admin/users" />} />
              </Route>
              <Route path="teachers/*">
                <Route path="" element={<TeachersA />} />
                <Route path="edit/:id" element={<EditTeacherA />} />
                <Route path="register" element={<RegisterTeacherA />} />
                <Route path="*" element={<Navigate to="/admin/teachers" />} />
              </Route>
              <Route path="students/*">
                <Route path="" element={<Students />} />
                <Route path="edit/:id" element={<EditStudent />} />
                <Route path="register" element={<RegisterStudent />} />
                <Route path="*" element={<Navigate to="/admin/students" />} />
              </Route>
              <Route path="parents/*">
                <Route path="" element={<Parents />} />
                <Route path="edit/:id" element={<EditParent />} />
                <Route path="register" element={<RegisterParent />} />
                <Route path="*" element={<Navigate to="/admin/parents" />} />
              </Route>
              <Route path="subjects/*">
                <Route path="" element={<Subjects />} />
                <Route
                  path="edit/students/:id"
                  element={<EditSubject type="student" />}
                />
                <Route
                  path="edit/teacher/:id"
                  element={<EditSubject type="teacher" />}
                />
                <Route path="register" element={<RegisterSubject />} />
                <Route path="*" element={<Navigate to="/admin/subjects" />} />
              </Route>
              <Route path="counselors/*">
                <Route path="" element={<CounselorsA />} />
                {/* <Route path="edit/:id" element={<EditCounselorA />} /> */}
                <Route path="register" element={<RegisterCounselorA />} />
                <Route path="*" element={<Navigate to="/admin/counselors" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="teacher" />}>
            <Route path="/teacher/*">
              <Route path="assists/*">
                <Route path="" element={<Assists />} />
                <Route path="*" element={<Navigate to="/teacher/assists" />} />
              </Route>
              <Route path="grades/*">
                <Route path="" element={<TeacherGrades />} />
                <Route path="*" element={<Navigate to="/teacher/grades" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="secretary" />}>
            <Route path="/secretary/*">
              <Route path="grades/*">
                <Route path="" element={<SecretaryGrades />} />
                <Route path="register" element={<RegisterGrades />} />
                <Route path="edit" element={<EditGrades />} />
                <Route path="*" element={<Navigate to="/secretary/grades" />} />
              </Route>
              <Route path="teachers/*">
                <Route path="" element={<TeachersS />} />
                <Route path="edit/:id" element={<EditTeacherS />} />
                <Route path="register" element={<RegisterTeacherS />} />
                <Route
                  path="*"
                  element={<Navigate to="/secretary/teachers" />}
                />
              </Route>
              <Route path="posts/*">
                <Route path="" element={<Posts />} />
                <Route path="register" element={<RegisterPost />} />
                <Route path="edit/:id" element={<EditPost />} />
                <Route path="*" element={<Navigate to="/secretary/posts" />} />
              </Route>
              {/* Cambiar el context */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="tutor" />}>
            <Route path="/tutor/*">
              {" "}
              {/* Cambiar el context */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="principal" />}>
            <Route path="/principal/*">
              <Route path="grades/*">
                <Route path="" element={<GradesP />} />
                <Route path="*" element={<Navigate to="/principal/grades" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="viceprincipal" />}>
            <Route path="/viceprincipal/*">
              <Route path="teachers/*">
                <Route path="" element={<TeachersVP />} />
                <Route path="edit/:id" element={<EditTeacherVP />} />
                <Route path="register" element={<RegisterTeacherVP />} />
                <Route
                  path="*"
                  element={<Navigate to="/viceprincipal/teachers" />}
                />
              </Route>
              <Route path="grades/*">
                <Route path="" element={<GradesVP />} />
                <Route path="register" element={<RegisterGradesVP />} />
                <Route path="edit" element={<EditGradesVP />} />
                <Route
                  path="*"
                  element={<Navigate to="/viceprincipal/grades" />}
                />
              </Route>
              <Route path="posts/*">
                <Route path="" element={<PostsVP />} />
                <Route path="register" element={<RegisterPostVP />} />
                <Route path="edit/:id" element={<EditPostVP />} />
                <Route
                  path="*"
                  element={<Navigate to="/viceprincipal/posts" />}
                />
              </Route>
              <Route path="subjects/*">
                <Route path="" element={<SubjectsVP />} />
                <Route
                  path="edit/students/:id"
                  element={<EditSubjectVP type="student" />}
                />
                <Route
                  path="edit/teacher/:id"
                  element={<EditSubjectVP type="teacher" />}
                />
                <Route path="*" element={<Navigate to="/admin/subjects" />} />
              </Route>
              <Route path="counselors/*">
                <Route path="" element={<CounselorsV />} />
                {/* <Route path="edit/:id" element={<EditCounselorA />} /> */}
                <Route path="register" element={<RegisterCounselorV />} />
                <Route path="*" element={<Navigate to="/admin/counselors" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>

          <Route element={<RolValidator rolRoute="academiccoor" />}>
            <Route path="/academiccoor/*">
              <Route path="schedule/*">
                <Route path="" element={<EventsAC />} />
                <Route
                  path="*"
                  element={<Navigate to="/academiccoor/shedule" />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h1>Not found.</h1>} />
    </Routes>
  );
}

export default App;
