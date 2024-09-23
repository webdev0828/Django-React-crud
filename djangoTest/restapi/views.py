from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer
from .serializers import PatientSerializer, AssessmentSerializer
from .models import Patient, Assessment

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_list(request):
    patients = Patient.objects.all().values('id', 'full_name', 'gender', 'phone_number', 'date_of_birth', 'address')
    
    # Filter by the logged-in clinician (user)
    clinician = request.user
    patients = Patient.objects.filter(clinician=clinician)  # Show only the assessments for the logged-in user
    
    # Sorting
    sort_by = request.GET.get('sort_by', 'id')  # Default sort field
    order = request.GET.get('order', 'asc')  # Ascending or descending
    if order == 'desc':
        sort_by = f'-{sort_by}'  # Add a '-' for descending order
    patients = patients.order_by(sort_by)

    # Pagination
    paginator = Paginator(patients, 5)  # Show 5 assessments per page
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    print(page_obj)

    # Serialize and return the paginated response
    patient_list = list(page_obj.object_list.values('id', 'full_name', 'gender', 'phone_number', 'date_of_birth', 'address'))
    
    return JsonResponse({
        'patients': patient_list,
        'count': paginator.count,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
    }, safe=False)
    
    # patient_list = list(patients)  # Convert queryset to list
    # return JsonResponse(patient_list, safe=False)  # Return the list as JSON

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def assessments_list(request):
    assessments = Assessment.objects.all().values('id', 'assessment_type', 'patient', 'assessment_date', 'questions_and_answers', 'final_score')

    # Get query parameters
    assessment_type = request.GET.get('assessment_type', None)
    patient_name = request.GET.get('patient', None)
    date_performed = request.GET.get('date_performed', None)
    
    # Filter by the logged-in clinician (user)
    clinician = request.user
    assessments = Assessment.objects.filter(clinician=clinician)  # Show only the assessments for the logged-in user
    
    # Filter by assessment type if provided
    if assessment_type:
        assessments = assessments.filter(assessment_type=assessment_type)

    # Filter by patient if provided
    if patient_name:
        assessments = assessments.filter(patient__full_name=patient_name)

    # Filter by date performed if provided
    if date_performed:
        assessments = assessments.filter(assessment_date=date_performed)
        
    # Sorting
    sort_by = request.GET.get('sort_by', 'assessment_date')  # Default sort field
    order = request.GET.get('order', 'asc')  # Ascending or descending
    if order == 'desc':
        sort_by = f'-{sort_by}'  # Add a '-' for descending order
    assessments = assessments.order_by(sort_by)

    # Pagination
    paginator = Paginator(assessments, 5)  # Show 5 assessments per page
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    # Serialize and return the paginated response
    assessment_list = list(page_obj.object_list.values('id', 'assessment_type', 'patient', 'assessment_date', 'questions_and_answers', 'final_score'))
    
    return JsonResponse({
        'assessments': assessment_list,
        'count': paginator.count,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
    }, safe=False)

@api_view(['POST', 'PUT', 'DELETE'])
def patients_operate(request, id=None):
    clinician = request.user  # Get the logged-in clinician
    
    if request.method == 'POST':
        # Automatically associate the clinician with the new assessment
        data = request.data.copy()  # Create a copy of the request data
        data['clinician'] = clinician.id  # Associate the logged-in clinician
        serializer = PatientSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        try:
            patient_to_edit = Patient.objects.get(id=id)
        except Patient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = PatientSerializer(patient_to_edit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        try:
            patient = Patient.objects.get(id=id)
            patient.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Patient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['POST', 'PUT', 'DELETE'])
def assessments_operate(request, id=None):
    clinician = request.user  # Get the logged-in clinician
    
    if request.method == 'POST':
        # Automatically associate the clinician with the new assessment
        data = request.data.copy()  # Create a copy of the request data
        data['clinician'] = clinician.id  # Associate the logged-in clinician
        serializer = AssessmentSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            assessment_to_edit = Assessment.objects.get(id=id)
        except Assessment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = AssessmentSerializer(assessment_to_edit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        try:
            assessment = Assessment.objects.get(id=id)
            assessment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Assessment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            user = User.objects.get(username=request.data['username'])
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)