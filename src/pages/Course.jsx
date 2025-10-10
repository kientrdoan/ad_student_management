"use client"

import { useEffect, useState } from "react"
import { Table, Button, Modal, Form, Input, Space, message, Select, Dropdown, Checkbox, Tag } from "antd"
import { SearchOutlined, SettingOutlined, EditOutlined, PlusOutlined, ReadOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { addCourseAction, editCourseAction, getAllCourseAction } from "../redux/actions/CourseAction"
import { getAllSemesterAction } from "../redux/actions/SemesterAction"
import { getAllClassAction } from "../redux/actions/ClassAction"
import { getAllTeacherAction } from "../redux/actions/TeacherAction"
import { getAllSubjectAction } from "../redux/actions/SubjectAction"
import { getAllRoomAction } from "../redux/actions/RoomAction"
import dayjs from "dayjs"

export default function Course() {
  const dispatch = useDispatch()
  const courses = useSelector((state) => state.CourseReducer.courses)
  const semesters = useSelector((state) => state.SemesterReducer.semesters)
  const classes = useSelector((state) => state.ClassReducer.classes)
  const teachers = useSelector((state) => state.TeacherReducer.teachers)
  const subjects = useSelector((state) => state.SubjectReducer.subjects)
  const rooms = useSelector((state) => state.RoomReducer.rooms)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    semester: true,
    class_st: true,
    teacher: true,
    subject: true,
    room: true,
    max_capacity: true,
    created_at: false,
    updated_at: false,
  })

  useEffect(() => {
    dispatch(getAllCourseAction())
    dispatch(getAllSemesterAction())
    dispatch(getAllClassAction())
    dispatch(getAllTeacherAction())
    dispatch(getAllSubjectAction())
    dispatch(getAllRoomAction())
  }, [dispatch])

  const showAddModal = () => {
    setEditingRecord(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const showEditModal = (record) => {
    setEditingRecord(record)

    form.setFieldsValue({
      semester: record.semester?.id,
      class_st: record.class_st?.id,
      teacher: record.teacher?.id,
      subject: record.subject?.id,
      room: record.room?.id,
      max_capacity: record.max_capacity,
    })

    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      let res
      if (editingRecord) {
        res = await dispatch(editCourseAction(editingRecord.id, values))
      } else {
        res = await dispatch(addCourseAction(values))
      }

      if (res.success) {
        message.success(editingRecord ? "Edit course successfully!" : "Add course successfully!")
        dispatch(getAllCourseAction())
        setIsModalVisible(false)
        form.resetFields()
      } else {
        message.error("Failed to save course!")
      }
    } catch (err) {
      console.log("Validate Failed:", err)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const filteredData = courses.filter((course) => {
    const searchLower = searchText.toLowerCase()
    return (
      course.semester?.semesters?.toLowerCase().includes(searchLower) ||
      course.class_st?.name?.toLowerCase().includes(searchLower) ||
      course.teacher?.name?.toLowerCase().includes(searchLower) ||
      course.subject?.name?.toLowerCase().includes(searchLower) ||
      course.room?.room_code?.toLowerCase().includes(searchLower) ||
      course.max_capacity?.toString().includes(searchLower)
    )
  })

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }))
  }

  const columnMenu = {
    items: [
      {
        key: "id",
        label: (
          <Checkbox checked={visibleColumns.id} onChange={() => toggleColumn("id")}>
            ID
          </Checkbox>
        ),
      },
      {
        key: "semester",
        label: (
          <Checkbox checked={visibleColumns.semester} onChange={() => toggleColumn("semester")}>
            Semester
          </Checkbox>
        ),
      },
      {
        key: "class_st",
        label: (
          <Checkbox checked={visibleColumns.class_st} onChange={() => toggleColumn("class_st")}>
            Class
          </Checkbox>
        ),
      },
      {
        key: "teacher",
        label: (
          <Checkbox checked={visibleColumns.teacher} onChange={() => toggleColumn("teacher")}>
            Teacher
          </Checkbox>
        ),
      },
      {
        key: "subject",
        label: (
          <Checkbox checked={visibleColumns.subject} onChange={() => toggleColumn("subject")}>
            Subject
          </Checkbox>
        ),
      },
      {
        key: "room",
        label: (
          <Checkbox checked={visibleColumns.room} onChange={() => toggleColumn("room")}>
            Room
          </Checkbox>
        ),
      },
      {
        key: "max_capacity",
        label: (
          <Checkbox checked={visibleColumns.max_capacity} onChange={() => toggleColumn("max_capacity")}>
            Max Capacity
          </Checkbox>
        ),
      },
      {
        key: "created_at",
        label: (
          <Checkbox checked={visibleColumns.created_at} onChange={() => toggleColumn("created_at")}>
            Created At
          </Checkbox>
        ),
      },
      {
        key: "updated_at",
        label: (
          <Checkbox checked={visibleColumns.updated_at} onChange={() => toggleColumn("updated_at")}>
            Updated At
          </Checkbox>
        ),
      },
    ],
  }

  const allColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80, visible: visibleColumns.id },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      render: (semester) => (semester?.semesters ? <Tag color="magenta">{semester.semesters}</Tag> : "N/A"),
      visible: visibleColumns.semester,
    },
    {
      title: "Class",
      dataIndex: "class_st",
      key: "class_st",
      render: (class_st) => (class_st?.name ? <Tag color="blue">{class_st.name}</Tag> : "N/A"),
      visible: visibleColumns.class_st,
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
      render: (instructor) => instructor?.name || "N/A",
      visible: visibleColumns.teacher,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => subject?.name || "N/A",
      visible: visibleColumns.subject,
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room) => (room?.room_code ? <Tag color="orange">{room.room_code}</Tag> : "N/A"),
      visible: visibleColumns.room,
    },
    {
      title: "Max Capacity",
      dataIndex: "max_capacity",
      key: "max_capacity",
      visible: visibleColumns.max_capacity,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => showEditModal(record)} className="text-indigo-600">
          {/* Edit */}
        </Button>
      ),
      visible: true,
      fixed: "right",
      width: 100,
    },
  ]

  const columns = allColumns.filter((col) => col.visible)

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ReadOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
              <p className="text-sm text-gray-500">Manage course schedules and assignments</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large" className="shadow-sm">
            Add Course
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
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Edit Course" : "Add Course"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Semester" name="semester" rules={[{ required: true, message: "Please select semester!" }]}>
            <Select placeholder="Select semester">
              {semesters?.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.semesters}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Class" name="class_st" rules={[{ required: true, message: "Please select class!" }]}>
            <Select placeholder="Select class">
              {classes?.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Teacher" name="teacher" rules={[{ required: true, message: "Please select teacher!" }]}>
            <Select placeholder="Select teacher">
              {teachers?.map((i) => (
                <Select.Option key={i.id} value={i.id}>
                  {i.user.first_name} {i.user.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Room" name="room" rules={[{ required: true, message: "Please select room!" }]}>
            <Select placeholder="Select room">
              {rooms?.map((i) => (
                <Select.Option key={i.id} value={i.id}>
                  {i.room_code} - {i.building}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Subject" name="subject" rules={[{ required: true, message: "Please select subject!" }]}>
            <Select placeholder="Select subject">
              {subjects?.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Max Capacity"
            name="max_capacity"
            rules={[{ required: true, message: "Please input max capacity!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
