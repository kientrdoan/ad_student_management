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
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseAction,
  editCourseAction,
  getAllCourseAction,
} from "../redux/actions/CourseAction";
import { getAllSemesterAction } from "../redux/actions/SemesterAction";
import { getAllClassAction } from "../redux/actions/ClassAction";
import { getAllTeacherAction } from "../redux/actions/TeacherAction";
import { getAllSubjectAction } from "../redux/actions/SubjectAction";
import { getAllRoomAction } from "../redux/actions/RoomAction";
import dayjs from "dayjs";

export default function Course() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.CourseReducer.courses);
  const semesters = useSelector((state) => state.SemesterReducer.semesters);
  const classes = useSelector((state) => state.ClassReducer.classes);
  const teachers = useSelector((state) => state.TeacherReducer.teachers);
  const subjects = useSelector((state) => state.SubjectReducer.subjects);
  const rooms = useSelector((state) => state.RoomReducer.rooms);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);

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
    created_at: false,
    updated_at: false,
  });

  useEffect(() => {
    dispatch(getAllCourseAction());
    dispatch(getAllSemesterAction());
    dispatch(getAllClassAction());
    dispatch(getAllTeacherAction());
    dispatch(getAllSubjectAction());
    dispatch(getAllRoomAction());
  }, [dispatch]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setSelectedSemester(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    setSelectedSemester(record.semester);

    form.setFieldsValue({
      semester: record.semester?.id,
      class_st: record.class_st?.id,
      teacher: record.teacher?.id,
      subject: record.subject?.id,
      room: record.room?.id,
      max_capacity: record.max_capacity,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
      weekday: record.weekday,
      start_period: record.start_period
    });

    setIsModalVisible(true);
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
        message.success(
          editingRecord
            ? "Edit course successfully!"
            : "Add course successfully!"
        );
        dispatch(getAllCourseAction());
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error("Failed to save course!");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      render: (semester) =>
        semester?.semesters ? (
          <Tag color="magenta">{semester.semesters}</Tag>
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
        class_st?.name ? <Tag color="blue">{class_st.name}</Tag> : "N/A",
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
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => subject?.name || "N/A",
      visible: visibleColumns.subject,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (room) =>
        room?.room_code ? <Tag color="orange">{room.room_code}</Tag> : "N/A",
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
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => showEditModal(record)}
          className="text-indigo-600"
        />
      ),
      visible: true,
      fixed: "right",
      width: 100,
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ReadOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lớp tín chỉ</h1>
              <p className="text-sm text-gray-500">
                Manage course schedules and assignments
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            size="large"
            className="shadow-sm"
          >
            Thêm mới
          </Button>

          <Space size="middle">
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size="large"
              allowClear
              className="rounded-lg"
            />
            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button icon={<SettingOutlined />} size="large" className="rounded-lg">
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className="flex-1 overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
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
        okText="Save"
        width={800}
      >
        <Form form={form} layout="vertical">
          {/* ====== Row 1: Semester - Class ====== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Học kỳ"
                name="semester"
                rules={[{ required: true, message: "Vui lòng chọn học kỳ!" }]}
              >
                <Select
                  placeholder="Vui lòng chọn học kỳ"
                  onChange={(value) => {
                    const semester = semesters.find((s) => s.id === value);
                    setSelectedSemester(semester);
                    form.setFieldsValue({ start_date: null, end_date: null });
                  }}
                >
                  {semesters?.map((s) => (
                    <Select.Option key={s.id} value={s.id}>
                      {s.semesters}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Lớp sinh viên"
                name="class_st"
                rules={[{ required: true, message: "Vui lòng chọn lớp sinh viên!" }]}
              >
                <Select placeholder="Vui lòng chọn lớp sinh viên">
                  {classes?.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ====== Row 2: Teacher - Room ====== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giáo viên"
                name="teacher"
                rules={[{ required: true, message: "Vui lòng chọn giáo viên!" }]}
              >
                <Select placeholder="Vui lòng chọn giáo viên">
                  {teachers?.map((i) => (
                    <Select.Option key={i.id} value={i.id}>
                      {i.user.first_name} {i.user.last_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phòng"
                name="room"
                rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}
              >
                <Select placeholder="Vui lòng chọn phòng">
                  {rooms?.map((i) => (
                    <Select.Option key={i.id} value={i.id}>
                      {i.room_code} - {i.building}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* ====== Row 3: Subject - Max Capacity ====== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Môn học"
                name="subject"
                rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
              >
                <Select placeholder="Vui lòng chọn môn học">
                  {subjects?.map((s) => (
                    <Select.Option key={s.id} value={s.id}>
                      {s.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="max_capacity"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng tối đa!" },
                ]}
              >
                <Input
                  type="number"
                  min={1}
                  placeholder="Vui lòng nhập số lượng tối đa"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* ====== Row 4: Start Date - End Date ====== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="start_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
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

            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="end_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
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

          {/* ====== Row 5: Weekday ====== */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thứ"
                name="weekday"
                rules={[{ required: true, message: "Vui lòng chọn thứ!" }]}
              >
                <Select placeholder="Select weekday">
                  <Select.Option value="Monday">Monday</Select.Option>
                  <Select.Option value="Tuesday">Tuesday</Select.Option>
                  <Select.Option value="Wednesday">Wednesday</Select.Option>
                  <Select.Option value="Thursday">Thursday</Select.Option>
                  <Select.Option value="Friday">Friday</Select.Option>
                  <Select.Option value="Saturday">Saturday</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tiết bắt đầu"
                name="start_period"
                rules={[{ required: true, message: "Vui lòng nhập tiết bắt đầu!" }]}
              >
                <Input
                  type="number"
                  min={1}
                  placeholder="Vui lòng nhập tiết bắt đầu"
                />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Modal>
    </div>
  );
}
