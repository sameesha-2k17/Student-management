from rest_framework import serializers
from .models import User, Batch, Student, Attendance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    batch_name = serializers.CharField(source='batch.name', read_only=True)

    class Meta:
        model = Student
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_id_str = serializers.CharField(source='student.student_id', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'

class BulkAttendanceSerializer(serializers.Serializer):
    batch = serializers.PrimaryKeyRelatedField(queryset=Batch.objects.all())
    date = serializers.DateField()
    records = serializers.ListField(
        child=serializers.DictField()
    )
