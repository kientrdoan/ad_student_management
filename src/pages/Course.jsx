"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
  Dropdown,
  Checkbox,
  Tag,
  DatePicker,
  Row,
  Col,
  Spin,
  Upload,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  ReadOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseAction,
  addCourseFromFileAction,
  deleteCourseAction,
  editCourseAction,
  // getAllCourseAction,
  getAllCourseBySemesterAction,
  resetScheduleAction,
  setScheduleAction,
} from "../redux/actions/CourseAction";
import {
  getAllSemesterAction,
  getCurrentSemesterAction,
} from "../redux/actions/SemesterAction";
import { getAllClassAction } from "../redux/actions/ClassAction";
import {
  getAllTeacherAction,
  getTeacherByDepartmentAction,
} from "../redux/actions/TeacherAction";
import {
  getAllSubjectAction,
  getAllSubjectByMajorAction,
} from "../redux/actions/SubjectAction";
import { getAllRoomAction } from "../redux/actions/RoomAction";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { BiRecycle } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function Course() {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [semester, setSemester] = useState(null);

  const courses = useSelector((state) => state.CourseReducer.courses);
  const semesters = useSelector((state) => state.SemesterReducer.semesters);
  const current_semester = useSelector(
    (state) => state.SemesterReducer.current_semester
  );
  const classes = useSelector((state) => state.ClassReducer.classes);
  // const teachers = useSelector((state) => state.TeacherReducer.teachers);
  const teacher_departments = useSelector(
    (state) => state.TeacherReducer.teacher_departments
  );
  // const subjects = useSelector((state) => state.SubjectReducer.subjects);
  const subjects_majors = useSelector(
    (state) => state.SubjectReducer.subjects_majors
  );
  const rooms = useSelector((state) => state.RoomReducer.rooms);

  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [scheduleFile, setScheduleFile] = useState(null);
  const [holidayFile, setHolidayFile] = useState(null);

  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    semester: true,
    class_st: true,
    teacher: true,
    subject: true,
    room: true,
    max_capacity: true,
    start_date: true,
    end_date: true,
    weekday: true,
    start_period: true,
    is_deleted: true,
    created_at: false,
    updated_at: false,
  });

  useEffect(() => {
    dispatch(getAllSemesterAction("active"));
    dispatch(getCurrentSemesterAction(statusFilter));
    dispatch(getAllClassAction("active"));
    dispatch(getAllTeacherAction(statusFilter));
    dispatch(getAllSubjectAction("active"));
    dispatch(getAllRoomAction(statusFilter));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (semester) {
      dispatch(getAllCourseBySemesterAction(semester, statusFilter));
    }
  }, [semester, dispatch, statusFilter]);

  useEffect(() => {
    if (current_semester?.id && !semester) {
      setSemester(current_semester.id);
    }
  }, [current_semester, semester]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setSelectedSemester(null);
    setSelectedSubject(null);
    setIsModalVisible(true);
  };
  const showEditModal = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);

    const majorId =
      record?.class_st?.major_id ??
      record?.class_st?.major?.major_id ??
      record?.class_st?.major?.id ??
      null;

    if (majorId) {
      dispatch(getAllSubjectByMajorAction(majorId));
    }

    const departmentId =
      record?.class_st?.department_id ??
      record?.class_st?.major?.department_id ??
      null;
    if (departmentId) {
      dispatch(getTeacherByDepartmentAction(departmentId));
    }

    // Set các field vào form, bao gồm subject (set id để Form quản lý)
    form.setFieldsValue({
      semester: record.semester?.id,
      class_st: record.class_st?.id,
      subject: record.subject?.id,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
      max_capacity: record.max_capacity,
      weekday: record.weekday,
      start_period: record.start_period,
      room: record.room?.id,
      teacher: record.teacher?.id,
    });

    // Lưu subject object để hiển thị fallback nếu options chưa có
    setSelectedSubject(record.subject);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        start_date: values.start_date
          ? values.start_date.format("YYYY-MM-DD")
          : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      };

      let res;
      if (editingRecord) {
        res = await dispatch(editCourseAction(editingRecord.id, payload));
      } else {
        res = await dispatch(addCourseAction(payload));
      }

      if (res.success) {
        messageApi.success(
          editingRecord
            ? "Edit course successfully!"
            : "Add course successfully!"
        );
        dispatch(getAllCourseBySemesterAction(semester, statusFilter));
        setIsModalVisible(false);
        form.resetFields();
      } else {
        messageApi.error("Failed to save course!");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedSubject(null);
  };

  const filteredData = courses.filter((course) => {
    const searchLower = searchText.toLowerCase();
    return (
      course.semester?.semesters?.toLowerCase().includes(searchLower) ||
      course.class_st?.name?.toLowerCase().includes(searchLower) ||
      course.teacher?.name?.toLowerCase().includes(searchLower) ||
      course.subject?.name?.toLowerCase().includes(searchLower) ||
      course.room?.room_code?.toLowerCase().includes(searchLower) ||
      course.max_capacity?.toString().includes(searchLower)
    );
  });

  const handleStatus = (value) => {
    // if (value === "all") {
    //   dispatch(getAllSemesterAction({}));
    //   dispatch(getCurrentSemesterAction({}));
    //   dispatch(getAllClassAction({}));
    //   dispatch(getAllTeacherAction({}));
    //   dispatch(getAllSubjectAction({}));
    //   dispatch(getAllRoomAction({}));
    // } else if (value === "active") {
    //   dispatch(getAllSemesterAction(statusFilter));
    //   dispatch(getCurrentSemesterAction(statusFilter));
    //   dispatch(getAllClassAction(statusFilter));
    //   dispatch(getAllTeacherAction(statusFilter));
    //   dispatch(getAllSubjectAction(statusFilter));
    //   dispatch(getAllRoomAction(statusFilter));
    // } else {
    //   dispatch(getAllSemesterAction(statusFilter));
    //   dispatch(getCurrentSemesterAction(statusFilter));
    //   dispatch(getAllClassAction(statusFilter));
    //   dispatch(getAllTeacherAction(statusFilter));
    //   dispatch(getAllSubjectAction(statusFilter));
    //   dispatch(getAllRoomAction(statusFilter));
    // }
    setStatusFilter(value);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const columnMenu = {
    items: Object.keys(visibleColumns).map((key) => ({
      key,
      label: (
        <Checkbox
          checked={visibleColumns[key]}
          onChange={() => toggleColumn(key)}
        >
          {key}
        </Checkbox>
      ),
    })),
  };

  const allColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      visible: visibleColumns.id,
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      render: (subject, record) => {
        if (!subject) return "N/A";
        console.log(record)

        return (
          <Link
            to={`/time-slot/${record.id}`}
            className='text-blue-600 hover:underline'
          >
            {subject.name}
          </Link>
        );
      },
      visible: visibleColumns.subject,
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      render: (semester) =>
        semester?.semesters ? (
          <Tag color='magenta'>{semester.semesters}</Tag>
        ) : (
          "N/A"
        ),
      visible: visibleColumns.semester,
    },
    {
      title: "Lớp sinh viên",
      dataIndex: "class_st",
      key: "class_st",
      render: (class_st) =>
        class_st?.name ? <Tag color='blue'>{class_st.name}</Tag> : "N/A",
      visible: visibleColumns.class_st,
    },
    {
      title: "Giáo viên",
      dataIndex: "teacher",
      key: "teacher",
      render: (instructor) => instructor?.name || "N/A",
      visible: visibleColumns.teacher,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (room) =>
        room?.room_code ? <Tag color='orange'>{room.room_code}</Tag> : "N/A",
      visible: visibleColumns.room,
    },
    {
      title: "Số lượng tối đa",
      dataIndex: "max_capacity",
      key: "max_capacity",
      visible: visibleColumns.max_capacity,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      visible: visibleColumns.start_date,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      visible: visibleColumns.end_date,
    },
    {
      title: "Thứ",
      dataIndex: "weekday",
      key: "weekday",
      visible: visibleColumns.weekday,
    },
    {
      title: "Tiết bắt đầu",
      dataIndex: "start_period",
      key: "start_period",
      visible: visibleColumns.start_period,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      visible: visibleColumns.is_deleted,
      render: (is_deleted) =>
        is_deleted === undefined ? (
          <Tag color='default'>N/A</Tag>
        ) : is_deleted === false ? (
          <Tag color='green'>Hoạt động</Tag>
        ) : (
          <Tag color='red'>Không hoạt động</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.is_deleted === true ? (
          <Button
            type='link'
            icon={<BiRecycle />}
            onClick={() => handleDelete(record.id)}
            className='text-indigo-600'
          />
        ) : (
          <Space>
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              className='text-indigo-600'
            />
            <Popconfirm
              title='Bạn có chắc muốn xoá thông tin lop này?'
              okText='OK'
              cancelText='Hủy'
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      visible: true,
      fixed: "right",
      width: 100,
    },
  ];

  const handleDelete = async (id) => {
    const res = await dispatch(deleteCourseAction(id));
    if (res.success) {
      messageApi.success("thành công!");
      dispatch(getAllCourseBySemesterAction(semester, statusFilter));
    } else {
      messageApi.error("Thất bại!");
    }
  };

  const resetSchedule = async () => {
    if (!semester) {
      messageApi.warning("Vui lòng chọn học kỳ trước khi khôi phục!");
      return;
    }
    const resutl = await dispatch(resetScheduleAction(semester));
    if (resutl.success) {
      messageApi.success("Khôi phục lịch học thành công!");
      dispatch(getAllCourseBySemesterAction(semester, "active"));
    }
  };

  const handleScheduleOk = async () => {
    if (!semester) {
      messageApi.warning("Vui lòng chọn học kỳ trước khi xếp lịch!");
      return;
    }

    if (!scheduleFile) {
      messageApi.open({
        type: "warning",
        content: "Vui lòng chọn file thời khóa biểu!",
      });
      return;
    }

    setLoadingSchedule(true);

    const payload = {
      semester_id: semester,
      population_size: 100,
      generations: 200,
      excel_file: scheduleFile,
      holiday_file: holidayFile || null, // thêm file ngày lễ (có thể null)
    };

    console.log("🎯 Payload xếp lịch:", payload);

    try {
      const result = await dispatch(setScheduleAction(payload));
      if (result.success) {
        messageApi.open({
          type: "success",
          content: "Xếp lịch thành công!",
        });
        dispatch(getAllCourseBySemesterAction(semester, "active"));
        setIsScheduleModalVisible(false);
      } else {
        messageApi.error("Xếp lịch thất bại!");
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Đã có lỗi xảy ra khi xếp lịch!");
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleScheduleCancel = () => {
    setIsScheduleModalVisible(false);
    setScheduleFile(null);
  };

  const handleScheduleFileChange = (info) => {
    if (info.fileList.length === 0) {
      setScheduleFile(null);
      return;
    }
    setScheduleFile(info.fileList[0].originFileObj);
  };

  const showScheduleModal = () => {
    setScheduleFile(null);
    setIsScheduleModalVisible(true);
  };

  // const parseExcel = async (file) => {
  //   const data = await file.arrayBuffer();
  //   const workbook = XLSX.read(data);
  //   const sheet = workbook.Sheets[workbook.SheetNames[0]];

  //   // Trả về danh sách JSON từ Excel
  //   return XLSX.utils.sheet_to_json(sheet);
  // };

  const handleImportOk = async () => {
    if (!importFile) {
      messageApi.warning("Vui lòng chọn file Excel!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", importFile);
      formData.append("semester_id", semester);

      // Gọi API upload file
      const res = await dispatch(addCourseFromFileAction(formData));

      if (res?.success) {
        messageApi.success(`Thêm thành công: ${res.data} lớp tín chỉ`);
      } else {
        messageApi.error(
          "Thêm thất bại. Vui lòng kiểm tra lại dữ liệu đầu vào!"
        );
      }

      // Refresh danh sách
      dispatch(getAllCourseBySemesterAction(semester, statusFilter));

      // Reset UI
      setIsImportModalVisible(false);
      setImportFile(null);
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi upload file!");
    }
  };

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className='h-full flex flex-col'>
      {contextHolder}
      <div className='bg-white rounded-xl shadow-sm p-6 flex flex-col h-full'>
        <div className='mb-6 flex-shrink-0'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
              <ReadOutlined className='text-indigo-600 text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Lớp tín chỉ</h1>
              <p className='text-sm text-gray-500'>
                Manage course schedules and assignments
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-6 gap-4 flex-shrink-0'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={showAddModal}
            size='large'
            className='shadow-sm'
          >
            Thêm mới
          </Button>

          <Select
            value={semester ?? undefined}
            onChange={(value) => {
              console.log("🎯 Chọn semester:", value);
              setSemester(value);
            }}
            options={semesters.map((s) => ({
              value: s.id,
              label: `${s.semesters} - Năm học ${s.year}`,
            }))}
            placeholder='Chọn học kỳ'
            className='w-full md:w-1/3'
          />

          <Space size='middle'>
            <Input
              placeholder='Search courses...'
              prefix={<SearchOutlined className='text-gray-400' />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size='large'
              allowClear
              className='rounded-lg'
            />

            <Select
              value={statusFilter}
              onChange={handleStatus}
              style={{ width: 180 }}
              size='large'
              options={[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Không hoạt động" },
              ]}
            />

            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button
                icon={<SettingOutlined />}
                size='large'
                className='rounded-lg'
              >
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className='flex items-center justify-between mb-6 gap-4 flex-shrink-0'>
          <div>
            <Button
              type='primary'
              // icon={<PlusOutlined />}
              onClick={() => setIsImportModalVisible(true)}
              size='large'
              className='shadow-sm'
            >
              Import data
            </Button>
          </div>

          <div className='flex items-center mb-6 gap-4 flex-shrink-0'>
            <Spin spinning={loadingSchedule}>
              <Button
                type='primary'
                onClick={showScheduleModal}
                size='large'
                loading={loadingSchedule}
              >
                Xếp lịch
              </Button>
            </Spin>

            <Button
              type='primary'
              // icon={<PlusOutlined />}
              onClick={resetSchedule}
              size='large'
              className='shadow-sm'
            >
              Khôi phục
            </Button>
          </div>
        </div>

        <div className='flex-1 overflow-hidden'>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey='id'
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} courses`,
            }}
          />
        </div>
      </div>

      {/* ====== Modal Add/Edit ====== */}
      <Modal
        title={editingRecord ? "Edit Course" : "Add Course"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Save'
        width={800}
      >
        <Form form={form} layout='vertical'>
          {/* ====== Row 1: Semester - Class ====== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Học kỳ'
                name='semester'
                rules={[{ required: true, message: "Vui lòng chọn học kỳ!" }]}
              >
                <Select
                  placeholder='Vui lòng chọn học kỳ'
                  onChange={(value) => {
                    const semester = semesters.find((s) => s.id === value);
                    setSelectedSemester(semester);
                    form.setFieldsValue({ start_date: null, end_date: null });
                  }}
                >
                  {semesters?.map((s) => (
                    <Select.Option key={s.id} value={s.id}>
                      {s.semesters} {s.year}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Lớp sinh viên'
                name='class_st'
                rules={[
                  { required: true, message: "Vui lòng chọn lớp sinh viên!" },
                ]}
              >
                <Select
                  placeholder='Vui lòng chọn lớp sinh viên'
                  onChange={(value) => {
                    const selectedClass = classes.find((c) => c.id === value);
                    setSelectedSemester(selectedClass.semester); // nếu cần
                    form.setFieldsValue({ start_date: null, end_date: null });
                    form.setFieldsValue({ teacher: undefined });

                    // load môn học theo ngành
                    if (selectedClass.major) {
                      dispatch(
                        getAllSubjectByMajorAction(selectedClass.major.major_id)
                      );
                    }

                    if (selectedClass.major) {
                      dispatch(
                        getTeacherByDepartmentAction(
                          selectedClass.major.department_id
                        )
                      );
                    }
                  }}
                >
                  {classes?.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ====== Row 2: Subject - Max Capacity ====== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Môn học'
                name='subject'
                rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
              >
                <Select
                  placeholder='Vui lòng chọn môn học'
                  onChange={(value) => {
                    const subject = subjects_majors.find((s) => s.id === value);
                    setSelectedSubject(subject);
                    // form.setFieldsValue({ start_date: null, end_date: null });
                  }}
                >
                  {/* Render options chính */}
                  {subjects_majors?.map((s) => (
                    <Select.Option key={s.id} value={s.id}>
                      {s.name} ({s.credit} tín chỉ)
                    </Select.Option>
                  ))}

                  {/* Nếu đang edit và môn hiện tại chưa có trong subjects_majors, thêm fallback Option để hiển thị tên */}
                  {selectedSubject &&
                    !subjects_majors?.some(
                      (s) => s.id === selectedSubject.id
                    ) && (
                      <Select.Option
                        key={selectedSubject.id}
                        value={selectedSubject.id}
                      >
                        {selectedSubject.name}{" "}
                        {selectedSubject.credit
                          ? `(${selectedSubject.credit} tín chỉ)`
                          : ""}
                      </Select.Option>
                    )}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Số lượng'
                name='max_capacity'
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng tối đa!" },
                ]}
              >
                <Input
                  type='number'
                  min={1}
                  placeholder='Nhập số lượng tối đa'
                />
              </Form.Item>
            </Col>
          </Row>

          {/* ====== ONLY SHOW THESE FIELDS WHEN EDITING ====== */}
          {editingRecord && (
            <>
              {/* ====== Row 3: Start Date - End Date ====== */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label='Ngày bắt đầu'
                    name='start_date'
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày bắt đầu!",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || !selectedSemester)
                            return Promise.resolve();
                          const totalPeriods =
                            selectedSubject?.total_period || 0;
                          const totalSessions = Math.ceil(totalPeriods / 5);
                          const endDate = dayjs(value).add(
                            totalSessions - 1,
                            "week"
                          );
                          const semesterEnd = dayjs(selectedSemester.end_date);
                          if (endDate.isAfter(semesterEnd)) {
                            return Promise.reject(
                              new Error(
                                `Ngày kết thúc dự kiến ${endDate.format(
                                  "YYYY-MM-DD"
                                )} vượt quá học kỳ!`
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <DatePicker
                      format='YYYY-MM-DD'
                      style={{ width: "100%" }}
                      disabledDate={(current) => {
                        if (!selectedSemester) return true;
                        const semesterStart = dayjs(
                          selectedSemester.start_date
                        );
                        const semesterEnd = dayjs(selectedSemester.end_date);
                        return current < semesterStart || current > semesterEnd;
                      }}
                      onChange={(date) => {
                        if (!date) {
                          form.setFieldsValue({ end_date: null });
                          return;
                        }

                        const semesterStart = dayjs(
                          selectedSemester.start_date
                        );
                        const semesterEnd = dayjs(selectedSemester.end_date);

                        if (
                          date.isBefore(semesterStart) ||
                          date.isAfter(semesterEnd)
                        ) {
                          messageApi.error(
                            "Ngày bắt đầu không phù hợp với học kỳ đã chọn!"
                          );
                          form.setFieldsValue({
                            start_date: null,
                            end_date: null,
                          });
                          return;
                        }

                        if (selectedSubject?.total_period) {
                          const totalPeriods = selectedSubject.total_period; // tổng số tiết
                          const periodsPerDay = 5; // cố định 5 tiết/ngày
                          const totalSessions = Math.ceil(
                            totalPeriods / periodsPerDay
                          ); // số buổi cần học

                          // Tính ngày kết thúc dự kiến
                          let endDate = dayjs(date).add(
                            totalSessions - 1,
                            "week"
                          );

                          // Nếu vượt học kỳ thì fix bằng ngày kết thúc học kỳ
                          if (endDate.isAfter(semesterEnd)) {
                            endDate = semesterEnd;
                            messageApi.warning(
                              `Ngày kết thúc dự kiến đã vượt học kỳ, tự động set bằng ${semesterEnd.format(
                                "YYYY-MM-DD"
                              )}`
                            );
                          }

                          // Set vào form để hiển thị ngay
                          form.setFieldsValue({
                            start_date: date,
                            end_date: endDate,
                          });
                        } else {
                          form.setFieldsValue({ start_date: date });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label='Ngày kết thúc'
                    name='end_date'
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày kết thúc!",
                      },
                    ]}
                  >
                    <DatePicker
                      format='YYYY-MM-DD'
                      style={{ width: "100%" }}
                      disabledDate={(current) => {
                        if (!selectedSemester) return false;
                        const start = dayjs(selectedSemester.start_date);
                        const end = dayjs(selectedSemester.end_date);
                        return current && (current < start || current > end);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label='Thứ'
                    name='weekday'
                    rules={[{ required: true, message: "Vui lòng chọn thứ!" }]}
                  >
                    <Select placeholder='Chọn thứ học'>
                      <Select.Option value='Monday'>Thứ Hai</Select.Option>
                      <Select.Option value='Tuesday'>Thứ Ba</Select.Option>
                      <Select.Option value='Wednesday'>Thứ Tư</Select.Option>
                      <Select.Option value='Thursday'>Thứ Năm</Select.Option>
                      <Select.Option value='Friday'>Thứ Sáu</Select.Option>
                      <Select.Option value='Friday'>Thứ Bảy</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Tiết bắt đầu'
                    name='start_period'
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tiết bắt đầu!",
                      },
                    ]}
                  >
                    <Input type='number' min={1} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label='Phòng học'
                    name='room'
                    rules={[
                      { required: true, message: "Vui lòng chọn phòng!" },
                    ]}
                  >
                    <Select placeholder='Chọn phòng'>
                      {rooms?.map((r) => (
                        <Select.Option key={r.id} value={r.id}>
                          {r.room_code}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label='Giáo viên'
                    name='teacher'
                    rules={[
                      { required: true, message: "Vui lòng chọn giáo viên!" },
                    ]}
                  >
                    <Select placeholder='Chọn giáo viên'>
                      {teacher_departments?.map((t) => (
                        <Select.Option key={t.id} value={t.id}>
                          {t.user.last_name} {t.user.first_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        title='Xếp lịch tự động'
        open={isScheduleModalVisible}
        onOk={handleScheduleOk}
        onCancel={handleScheduleCancel}
        confirmLoading={loadingSchedule}
        okText='Xếp lịch'
        width={600}
      >
        <p className='mb-2 font-semibold'>File danh sách lớp:</p>
        <Upload
          accept='.xlsx,.xls'
          beforeUpload={() => false}
          onChange={handleScheduleFileChange}
          maxCount={1}
          listType='text'
        >
          <Button icon={<UploadOutlined />}>
            Upload file thời khóa biểu (.xlsx)
          </Button>
        </Upload>

        <p className='mt-4 mb-2 font-semibold'>File ngày lễ (tùy chọn):</p>
        <Upload
          accept='.xlsx,.xls'
          beforeUpload={() => false}
          onChange={(info) => {
            if (info.fileList.length === 0) {
              setHolidayFile(null);
              return;
            }
            setHolidayFile(info.fileList[0].originFileObj);
          }}
          maxCount={1}
          listType='text'
        >
          <Button icon={<UploadOutlined />}>Upload file ngày lễ (.xlsx)</Button>
        </Upload>
      </Modal>

      <Modal
        title='Import Excel Courses'
        open={isImportModalVisible}
        onOk={handleImportOk}
        onCancel={() => setIsImportModalVisible(false)}
        okText='Import'
      >
        <Upload
          beforeUpload={() => false} // tự quản lý file
          onChange={(info) => {
            if (info.fileList.length > 0) {
              setImportFile(info.fileList[0].originFileObj);
            } else {
              setImportFile(null);
            }
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
        </Upload>

        <p className='mt-2 text-gray-500 text-sm'>
          Hỗ trợ: .xlsx | Format chứa các cột: semester, class, subject,
          teacher, room, start_date...
        </p>
      </Modal>
    </div>
  );
}
